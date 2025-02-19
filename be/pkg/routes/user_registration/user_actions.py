import base64
import hashlib
import json
from datetime import datetime, timedelta
from random import randbytes
from typing import List, Optional, Dict, Any

import pyotp
from bson import json_util, ObjectId
from fastapi import HTTPException, status, APIRouter, Request, Depends, Response, File, UploadFile, Body
from jose import jwt

from pkg.routes.user_registration.search_model import SearchResultModel, UserModel, MemberModel, CustomerModel, \
    TicketModel
from pkg.routes.user_registration.user_models import CreateUserSchema, LoginUserSchema, PasswordResetRequest, \
    UserResponse, LoginActivitySchema
from pkg.database.database import database
from pkg.routes.authentication import val_token, verify_otp
from pkg.routes.user_registration import user_utils
from pkg.routes.emails import Email
from pkg.routes.user_registration.user_utils import generate_otp, log_user_activity, cleanup_old_logins, \
    keep_last_three_logins
from pkg.routes.serializers.userSerializers import userEntity
from config.config import settings

user_router = APIRouter()
user_collection = database.get_collection('users')
customers_collection = database.get_collection('customers')
member_collections = database.get_collection('partners')
login_activity_collection = database.get_collection('login_activity')
user_collection.create_index("expireAt", expireAfterSeconds=10)
ticket_collection = database.get_collection('tickets')


@user_router.post("/user/register")
async def create_user(payload: CreateUserSchema):
    # Check if user already exists
    if payload.role in ['org-admin', 'admin', 'partner']:
        find_user = user_collection.find_one({'email': payload.email.lower()})
        if find_user:
            if not find_user['verified']:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail='User Not Verified, Please verify your email address'
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail='Account already exists'
                )
        else:
            # Compare password and passwordConfirm
            if payload.password != payload.passwordConfirm:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail='Passwords do not match'
                )

            # Hash the password
            payload.password = user_utils.hash_password(payload.password)
            del payload.passwordConfirm
            payload.verified = False
            payload.email = payload.email.lower()
            payload.created_at = datetime.now()
            payload.updated_at = payload.created_at
            payload_dict = payload.dict()

            if payload.photo:
                payload_dict['files'] = []
                for file in payload.photo:
                    file_data = await file.read()
                    file_id = database.store_file(file_data, file.filename)
                    payload_dict['files'].append({'file_id': str(file_id), 'file_name': file.filename})
            else:
                payload_dict['files'] = []

            result = user_collection.insert_one(payload_dict)
            new_user = user_collection.find_one({'_id': result.inserted_id})

            if new_user:
                try:
                    token = randbytes(10)
                    hashedCode = hashlib.sha256()
                    hashedCode.update(token)
                    verification_code = hashedCode.hexdigest()
                    secret = base64.b32encode(bytes(token.hex(), 'utf-8'))
                    verification_code = base64.b32encode(bytes(verification_code, 'utf-8'))
                    hotp_v = pyotp.HOTP(verification_code)
                    user_collection.find_one_and_update(
                        {"_id": result.inserted_id},
                        {
                            "$set": {
                                "verification_code": hotp_v.at(0),
                                "Verification_expireAt": datetime.now() + timedelta(
                                    minutes=settings.EMAIL_EXPIRATION_TIME_MIN),
                                "updated_at": datetime.now()
                            }
                        }
                    )
                    await Email(hotp_v.at(0), payload.email, 'verification',hotp_v.at(0)).send_email()
                except Exception as error:
                    user_collection.find_one_and_update(
                        {"_id": result.inserted_id},
                        {
                            "$set": {
                                "verification_code": None,
                                "updated_at": datetime.now()
                            }
                        }
                    )
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail='There was an error sending email'
                    )
                return {'status': 'success', 'message': 'Verification token successfully sent to your email'}
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail='There was an error registering user'
                )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='No permission to create User'
        )


@user_router.post('/user/login')
async def login(payload: LoginUserSchema, response: Response):
    # Check if the user exist
    db_user = user_collection.find_one({'email': payload.email.lower()})
    if not db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='Incorrect Email or Password')
    if db_user['role'] in ['admin', 'org-admin']:
        user = userEntity(db_user)
        ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        REFRESH_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        # Check if user verified his email
        if not user['verified']:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Please verify your email address')
        # Check if the password is valid
        if not user_utils.verify_password(payload.password, user['password']):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail='Incorrect Email or Password')

        # Create access token
        access_token = user_utils.create_refresh_token(user['email'], user['name'], user['role'], str(user['id']))

        # Create refresh token
        refresh_token = user_utils.create_access_token(user['email'], user['name'], user['role'], str(user['id']))

        # Store refresh and access tokens in cookie
        response.set_cookie('access_token', access_token, ACCESS_TOKEN_EXPIRES_IN * 60,
                            ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, True, True, 'none')
        response.set_cookie('refresh_token', refresh_token,
                            REFRESH_TOKEN_EXPIRES_IN * 60, REFRESH_TOKEN_EXPIRES_IN * 60, '/', None, False, True, 'lax')
        response.set_cookie('logged_in', 'True', ACCESS_TOKEN_EXPIRES_IN * 60,
                            ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, False, False, 'lax')
        # Log user activity
        log_user_activity(user['email'], db_user['role'], str(db_user['_id']))

        # Clean up old logins and keep the last 3 logins
        cleanup_old_logins()
        keep_last_three_logins(user['email'], db_user['role'], str(db_user['_id']))
        # Send both access
        return {'status': 'success', 'access_token': access_token}
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Invalid token or user not authorized')


@user_router.get("/user/me")
async def user_login(request: Request):
    """login session"""
    access_token = request.cookies.get("access_token")
    if access_token is None:
        raise HTTPException(status_code=400, detail="Token not found in cookies")
    else:
        payload = jwt.decode(access_token, settings.SECRET, algorithms=[settings.ALGORITHM])
        return payload


@user_router.post("/edit/users")
async def update_user(
        new_data: dict = Body(...),
        token: tuple = Depends(val_token),
):
    if token[0]:
        payload = token[1]
        user = user_collection.find_one({'email': payload["email"]})

        if user and user['role'] in ['org-admin', 'admin']:
            # Handle photo uploads
            # Update the user data in MongoDB
            result = user_collection.update_one({"_id": user["_id"]}, {"$set": new_data})

            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="User not found")
            if result.modified_count == 0:
                return {"message": "No changes made to the user data"}

            return {"message": "User updated successfully"}

        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='No permission to edit user')
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")


@user_router.post("/request-reset-password/")
async def request_reset_password(request: PasswordResetRequest):
    user = user_collection.find_one({'email': request.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reset_otp = generate_otp()
    # In a real application, send the reset password email asynchronously
    try:
        await Email(reset_otp['reset_otp'], request.email, 'reset').send_email()

    except Exception as error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail='There was an error sending email')
    user_collection.update_one({"_id": user["_id"]}, {"$set": reset_otp})
    return {"message": "Password reset email sent"}


@user_router.post("/reset-password/")
async def reset_password(new_password, otp: str = Depends(verify_otp)):
    if otp[0] is True:
        payload = otp[1]
        user = user_collection.find_one({'email': payload["email"]})
        if user:
            # Update the user data in MongoDB
            new_password = user_utils.hash_password(new_password)
            result = user_collection.update_one({"_id": user["_id"]},
                                                {"$set": {"password": new_password, "updated_at": datetime.now()}})
            if result:
                return {"message": "Password reset successfully"}
            else:
                raise HTTPException(status_code=501, detail="Unable to update password")

        else:
            raise HTTPException(status_code=404, detail="User not found")
    else:
        raise HTTPException(status_code=401, detail=token)


@user_router.get("/user/info", response_model=UserResponse)
async def get_user_info(token: str = Depends(val_token)):
    if token[0]:
        payload = token[1]
        user = user_collection.find_one({'email': payload["email"]})
        if user:
            try:
                members_count = len(user.get('members', []))
                user['members_count'] = members_count
                user['created_at'] = str(user['created_at'])
                user['photo'] = user.get('photo', [])
            except:
                raise HTTPException(status_code=400, detail="error retrieving data")
        else:
            raise HTTPException(status_code=404, detail="User not found")
    else:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return json.loads(json_util.dumps(user))


@user_router.get('/login/activity', response_model=List[LoginActivitySchema])
async def get_login_activity(token: str = Depends(val_token)):
    if token[0] is True:
        payload = token[1]
        if payload['role'] == 'customer':
            details = customers_collection.find_one({'email': payload['email']})
        elif payload['role'] == 'partner':
            details = member_collections.find_one({'email': payload['email']})
        elif payload['role'] in ['org-admin', 'admin']:
            details = user_collection.find_one({'email': payload['email']})
        activities = list(
            login_activity_collection.find(
                {'email': details['email'], 'role': payload['role'], 'user_id': str(details['_id'])}).sort(
                'timestamp', -1))

        if not activities:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No login activities found')

        return activities
    else:
        raise HTTPException(status_code=401, detail=token)


@user_router.post("/upload/photos")
async def upload_photos(
        photos: List[UploadFile] = File([]),
        token: tuple = Depends(val_token)
):
    global result
    if token[0]:
        payload = token[1]
        files_data = []
        if photos:
            for file in photos:
                file_data = await file.read()
                file_id = database.store_file(file_data, file.filename)  # Ensure db.store_file is implemented
                files_data.append({'file_id': str(file_id), 'file_name': file.filename})

        if payload['role'] == 'customer':
            details = customers_collection.find_one({'email': payload['email']})
            result = customers_collection.update_one({"_id": ObjectId(details["_id"])}, {"$set": {'photo': files_data}})
        elif payload['role'] == 'partner':
            details = member_collections.find_one({'email': payload['email']})
            result = member_collections.update_one({"_id": ObjectId(details["_id"])}, {"$set": {'photo': files_data}})
        elif payload['role'] in ['org-admin', 'admin']:
            details = user_collection.find_one({'email': payload['email']})
            result = user_collection.update_one({"_id": ObjectId(details["_id"])}, {"$set": {'photo': files_data}})
            payload['role'] = 'admin'

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        if result.modified_count == 0:
            return {"message": "No changes made to the user data"}

        return {"message": "User updated successfully"}

    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")


def search_collection(collection, query: str, fields: List[str]):
    search_query = {"$or": [{field: {"$regex": query.lower(), "$options": "i"}} for field in fields]}
    results = collection.find(search_query)
    return [{"id": str(item["_id"]), **item} for item in results]


@user_router.get('/search')
async def common_search(query: str, token: str = Depends(val_token)):
    if token[0] is True:
        payload = token[1]
        if payload['role'] in ['org-admin', 'admin']:
            # Define which fields to search in each collection
            user_fields = ["email", "name"]
            member_fields = ["partner_user_id", "email", "name", "phone"]
            customer_fields = ["name", "email", "phone"]
            ticket_fields = ["title","description"]

            # Search in each collection
            user_results = search_collection(user_collection, query, user_fields)
            member_results = search_collection(member_collections, query, member_fields)
            customer_results = search_collection(customers_collection, query, customer_fields)
            ticket_results = search_collection(ticket_collection, query, ticket_fields)
            # Convert the results to the appropriate models
            users = [UserModel(**user) for user in user_results]
            members = [MemberModel(**member) for member in member_results]
            customers = [CustomerModel(**customer) for customer in customer_results]
            tickets = [TicketModel(**ticket) for ticket in ticket_results]

            # Combine all results into the response model
            combined_results = SearchResultModel(
                users=users,
                members=members,
                customers=customers,
                tickets=tickets
            )
            return combined_results
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not Authorized")

    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")


@user_router.post("/user/logout")
def logout(response: Response):
    # Clear the access token
    response.set_cookie(
        key="access_token",
        value="",
        max_age=0,
        expires=0,
        path="/",
        domain=None,
        secure=True,  # Set to False for development over HTTP
        httponly=True,
        samesite="none"
    )

    # Clear the refresh token
    response.set_cookie(
        key="refresh_token",
        value="",
        max_age=0,
        expires=0,
        path="/",
        domain=None,
        secure=True,  # Set to False for development over HTTP
        httponly=True,
        samesite="none"
    )

    # Clear the logged_in indicator
    response.set_cookie(
        key="logged_in",
        value="",
        max_age=0,
        expires=0,
        path="/",
        domain=None,
        secure=True,  # Can be False if the logged_in cookie isn't critical
        httponly=False,  # Allow JavaScript access if needed
        samesite="none"
    )

    return {"message": "Logged out successfully"}

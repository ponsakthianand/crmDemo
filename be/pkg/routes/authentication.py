from datetime import datetime
from typing import List

from passlib.context import CryptContext
import jwt
from config.config import settings
from fastapi import HTTPException, status, Header, APIRouter, Depends
from fastapi.security import (OAuth2PasswordRequestForm)
from pkg.database.database import database
from pkg.routes.user_registration import user_utils

auth_router = APIRouter()
# password_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
password_context = CryptContext(["sha256_crypt"])


# def get_hashed_password(password):
#     """Get encrypted password"""
#     return password_context.hash(password)
#
#
# def verify_password(plain_password, hashed_password):
#     return password_context.verify(plain_password, hashed_password)

def get_hashed_password(password: str):
    try:
        hashed = password_context.hash(password)
        return hashed
    except Exception as e:
        print(f"Error hashing password: {e}")
        return None  # Optionally raise a custom exception

def verify_password(plain_password, hashed_password):
    try:
        return password_context.verify(plain_password, hashed_password)
    except UnknownHashError:
        print("Error: Unknown hash algorithm or invalid hash format.")
        return False
    except Exception as e:
        print(f"Error verifying password: {e}")
        return False


async def verify_token(token: str):
    """User verify token"""
    try:
        payload = jwt.decode(token, settings.SECRET, algorithms=[settings.ALGORITHM])
        from database.database import mongo_conn
        conn = mongo_conn()
        db = conn['growday']
        register = db.users
        user = await register.find_one({'email': payload["email"]})
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def authenticate_user(email, password, register):
    """authenticate User"""
    user = register.find_one({'email': email})
    if user and verify_password(password, user['password']):
        return user
    else:
        return False


async def verify_otp(otp: str):
    register = database.get_collection('users')
    expires_delta = datetime.now()
    result = register.find_one_and_update(
        filter={
            "reset_otp_exp": {"$gt": expires_delta},
            "reset_otp": otp
        },
        update={"$set": {"reset_otp": None}}, new=True, return_document=True)  # Return the updated document
    if not result:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail='Invalid verification code or Code Expired')
    return True, result


async def token_generator(username: str, password: str, register, expires_delta=None):
    """Token Generation"""
    from datetime import datetime, timedelta
    user = await authenticate_user(username, password, register)
    REFRESH_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if expires_delta is not None:
        expires_delta = datetime.now() + expires_delta
    else:
        expires_delta = datetime.now() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    token_data = {
        "exp": expires_delta, 'name': user['name'], 'email': user['email'], 'role': user['role'], id: str(user['id'])
    }
    token = jwt.encode(token_data, settings.SECRET)
    return token


# Define a function to validate the token
def val_token(token: str = Header(...)):
    # Extract the token from the header
    try:
        scheme, token = token.split(' ')
        if scheme.lower() != "bearer" or scheme is None:
            raise HTTPException(status_code=401, detail="Invalid token scheme. Must be Bearer")
        # Step 1: Decode the token and verify its integrity
        payload = jwt.decode(token, settings.SECRET, algorithms=[settings.ALGORITHM])
        # Step 2: Extract required claims
        issuer = payload.get("role")
        subject = payload.get("email")
        expiration_time = payload.get("exp")
        audience = payload.get("name")

        # Step 3: Validate required claims
        if not issuer or not subject or not expiration_time or not audience:
            raise ValueError("Invalid token: Missing required claims")

        # Step 4: Check token expiration
        current_time = datetime.now()
        if current_time > datetime.fromtimestamp(expiration_time):

            raise ValueError("Token has expired")
        # Token is valid
        return True, payload

    except jwt.ExpiredSignatureError:
        return False, "Token has expired"
    except jwt.InvalidTokenError:
        return False, "Invalid token"
    except HTTPException as e:
        return False, str(e)
    except ValueError as e:
        return False, str(e)


@auth_router.post('/token')
async def generate_token(request_form: OAuth2PasswordRequestForm = Depends()):
    """create a new token"""
    register = database.get_collection('users')
    token = await token_generator(request_form.username, request_form.password, register)
    return {"access_token": token, "token_type": "bearer"}


@auth_router.get('/verifyemail/{email}/{otp}')
async def verify_me(email: str, otp: str):
    # from database.database import mongo_conn
    # conn = mongo_conn()
    # db = conn['growday']
    # register = db.users
    register = database.get_collection('users')
    # hashedCode = hashlib.sha256()
    # hashedCode.update(bytes.fromhex(token))
    # verification_code = hashedCode.hexdigest()
    # print(verification_code)
    # import pyotp, base64
    # verification_code = base64.b32encode(bytes(verification_code, 'utf-8'))
    # hotp = pyotp.HOTP(verification_code)
    # print(hotp.at(0))

    result = register.find_one_and_update({"email": email, "verification_code": otp}, {
        "$set": {"verification_code": None, "verified": True, "updated_at": datetime.now()}}, new=True)
    print(result)
    access_token = user_utils.create_access_token(result['email'], result['name'], result['role'], str(result['_id']))
    if not result:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail='Invalid verification code or account already verified')

    return {
        "status": "success",
        "access_token": access_token,
        "message": "Account verified successfully"
    }


@auth_router.get('/members/verifyemail/{token}')
async def verify_partner(token):
    payload = jwt.decode(token, settings.SECRET, algorithms=[settings.ALGORITHM])
    print(payload)
    register = database.get_collection('partners')

    result = register.find_one_and_update({"email": payload['email'], "verification_code": payload['otp']}, {
        "$set": {"verification_code": None, "verified": True, "updated_at": datetime.now()}}, new=True)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail='Invalid verification code or account already verified')
    access_token = user_utils.create_access_token(result['email'], result['name'], result['role'], result['id'])

    return {
        "status": "success",
        "access_token": access_token,
        "message": "Account verified successfully"
    }


def generate_otp_token(user, otp, expires_delta=None):
    from datetime import datetime, timedelta
    if expires_delta is not None:
        expires_delta = datetime.now() + expires_delta
    else:
        expires_delta = datetime.now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data = {
        "exp": expires_delta, 'name': user['name'], 'email': user['email'], 'role': user['role'], 'otp': otp
    }
    token = jwt.encode(token_data, settings.SECRET)
    return token


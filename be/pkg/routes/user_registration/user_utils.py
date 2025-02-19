from fastapi import HTTPException
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from typing import Union, Any
from config.config import settings
from pkg.database.database import database
from passlib.exc import UnknownHashError

user_collection = database.get_collection('users')
login_activity_collection = database.get_collection('login_activity')
pwd_context = CryptContext(["sha256_crypt"])
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7


def hash_password(password: str):
    try:
        hashed = pwd_context.hash(password)
        return hashed
    except Exception as e:
        print(f"Error hashing password: {e}")
        return None  # Optionally raise a custom exception


def verify_password(password: str, hashed_password: str):
    try:
        return pwd_context.verify(password, hashed_password)
    except UnknownHashError:
        print("Error: Unknown hash algorithm or invalid hash format.")
        return False
    except Exception as e:
        print(f"Error verifying password: {e}")
        return False


def create_access_token(subject: Union[str, Any], name: str, role: str, userid: str,
                        expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "exp": expire,
        "email": str(subject),
        "name": name,
        "role": role, "id": userid
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt


def generate_otp():
    import random
    otp = ''.join(random.choices('0123456789', k=6))
    expiration_time = datetime.now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    reset_data = {
        "reset_otp": otp,
        "reset_otp_exp": expiration_time
    }
    return reset_data


def create_refresh_token(subject: Union[str, Any], name: str, role: str, userid: str, expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.now() + expires_delta
    else:
        expires_delta = datetime.now() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)

    to_encode = {"exp": expires_delta, "email": str(subject), "name": name, "role": role, "id": userid}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET, settings.ALGORITHM)
    return encoded_jwt


def validate_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET, algorithms=["HS256"])
        # Check if the token has expired
        if datetime.now() > datetime.fromtimestamp(payload["exp"]):
            raise jwt.ExpiredSignatureError("Token has expired")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token")


def log_user_activity(email: str, role: str, user_id: str):
    login_activity_collection.insert_one({
        'email': email,
        'role': role,
        'user_id': user_id,
        'created_at': datetime.now()
    })


def cleanup_old_logins():
    seven_days_ago = datetime.now() - timedelta(days=7)
    login_activity_collection.delete_many({'created_at': {'$lt': seven_days_ago}})


def keep_last_three_logins(email: str, role: str, user_id: str):
    query = {'email': email}
    if user_id:
        query[role] = user_id
    seven_days_ago = datetime.now() - timedelta(days=7)

    cursor = login_activity_collection.find(
        {'email': email, 'role': role, 'user_id': user_id, 'created_at': {'$lt': seven_days_ago}}).sort('created_at',
                                                                                                        -1).skip(3)
    ids_to_delete = [doc['_id'] for doc in cursor]
    if ids_to_delete:
        login_activity_collection.delete_many({'_id': {'$in': ids_to_delete}})

from pydantic_settings import BaseSettings
from pydantic import EmailStr, Field


class Settings(BaseSettings):
    EMAIL: EmailStr
    PASSWORD: str
    SECRET: str
    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_USERNAME : EmailStr
    EMAIL_PASSWORD : str

    EMAIL_FROM : EmailStr
    MONGO_INITDB_ROOT_USERNAME : EmailStr
    MONGO_INITDB_ROOT_PASSWORD : str
    MONGO_INITDB_DATABASE : str

    ACCESS_TOKEN_EXPIRE_MINUTES : int  # 30 minutes
    REFRESH_TOKEN_EXPIRE_MINUTES : str  # 7 days
    ALGORITHM : str
    JWT_SECRET_KEY : str  # should be kept secret
    JWT_REFRESH_SECRET_KEY : str  # should be kept secret
    DATABASE_URL : str
    EMAIL_EXPIRATION_TIME_MIN: int
    TWILIO_ACCOUNT_SID : str
    TWILIO_AUTH_TOKEN : str
    TWILIO_MESSAGING_SERVICE_SID : str


    class Config:
        env_file = '.env'
        extra = "allow"


settings = Settings()

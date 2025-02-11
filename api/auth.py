# function to generate an access token that lasts for a certain amount of time using the algorithm provided 
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import jwt
import os

load_dotenv()

# .env stores values as strings, so need to convert them to the appropriate types
secret_key = os.getenv("SECRET_KEY")
algorithm = os.getenv("ALGORITHM")
access_token_expires = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=access_token_expires)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=algorithm)

def get_claim(token: str):
    return jwt.decode(token, secret_key, algorithms=[algorithm])
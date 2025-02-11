from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt

from api.auth import create_access_token, get_claim

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != "me@email.com" or form_data.password != "password":
        return HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(
        data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

# gets the username of the person currently logged in
@router.get("/users/me")  
async def read_users_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = get_claim(token)
        return {"username": payload.get("sub")}
    except jwt.ExpiredSignatureError:
        return HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        return HTTPException(status_code=401, detail="Invalid token")
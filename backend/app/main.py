from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status, Header
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Ensure this matches your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Dummy user storage
fake_users_db = {
    "user@example.com": {
        "username": "user@example.com",
        "password": "123456",  # In reality, hash your passwords
        "full_name": "Example User",
    }
}

SECRET_KEY = os.getenv("SECRET_KEY", "your_super_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    full_name: str

class UserInDB(User):
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    to_encode.update({"type": "refresh"})  # Specify this is a refresh token
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return TokenData(username=payload.get("sub"))
    except JWTError as e:
        print(f"Access token verification error: {str(e)}")
        return None

def verify_refresh_token(authorization: str = Header(None)):
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":  # Ensure it's a refresh token
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type for refresh"
            )
        return TokenData(username=payload.get("sub"))
    except JWTError as e:
        print(f"Refresh token verification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    if not user or user["password"] != password:
        return False
    return user

@app.post("/login", response_model=Token)
def login(login_req: LoginRequest):
    user = authenticate_user(login_req.username, login_req.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    access_token = create_access_token({"sub": user["username"]})
    refresh_token = create_refresh_token({"sub": user["username"]})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

@app.post("/refresh", response_model=Token)
def refresh_token(token_data: TokenData = Depends(verify_refresh_token)):
    if not token_data or not token_data.username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    username = token_data.username
    new_access_token = create_access_token({"sub": username})
    return {
        "access_token": new_access_token,
        "refresh_token": None,  # Optionally issue a new refresh token if needed
        "token_type": "bearer",
    }

@app.get("/protected")
def protected_route(token_data: TokenData = Depends(verify_access_token)):
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    return {"message": f"Hello, {token_data.username}!"}

@app.get("/")
def root():
    return {"message": "Hello World1234!"}

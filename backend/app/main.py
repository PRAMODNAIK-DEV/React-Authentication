from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.auth_utils import create_access_token, create_refresh_token, verify_token
from datetime import datetime, timedelta

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

class Token(BaseModel):
    access_token: str
    refresh_token: str
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
def refresh_token(token_data: TokenData = Depends(verify_token)):
    if not token_data or not token_data.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    username = token_data["sub"]
    new_access_token = create_access_token({"sub": username})
    return {
        "access_token": new_access_token,
        "refresh_token": None,  # Refresh token remains unchanged on the client
        "token_type": "bearer",
    }

@app.get("/protected")
def protected_route(token_data: TokenData = Depends(verify_token)):
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    return {"message": f"Hello, {token_data.get('sub')}!"}


@app.get("/")
def root():
    return {"message": "Hellow World!"}

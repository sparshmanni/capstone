from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel,Field,EmailStr
from models import User
from database import SessionLocal
from config import settings
from dependencies import get_current_user

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

router = APIRouter(prefix="/auth", tags=["Auth"])

# JWT settings
ACCESS_TOKEN_EXPIRE_MINUTES = 60

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(..., max_length=72)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    new_user = User(username=user.username, email=user.email,password_hash=User.hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    # ✅ Try to find user by username OR email
    print(user)
    db_user = db.query(User).filter(
    (User.username == user.email) | (User.email == user.email)     
    ).first()

    # ❌ If user not found or password doesn’t match
    if not db_user or not db_user.verify_password(user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ Create JWT token
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": db_user.username, "exp": expire}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "token_type": "bearer"}



@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
    }
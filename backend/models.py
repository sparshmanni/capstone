from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from passlib.context import CryptContext
from datetime import datetime

Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- USER TABLE ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String)

    chats = relationship("ChatSession", back_populates="user")

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.password_hash)

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

# --- CHAT SESSION TABLE ---
class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, default="New Chat")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chats")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete")

# --- CHAT MESSAGE TABLE ---
class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    role = Column(String)  # 'user' or 'assistant'
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")

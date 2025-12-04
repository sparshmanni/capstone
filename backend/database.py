from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
import os
#from dotenv import load_dotenv
# Local development (SQLite)
#SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

#load_dotenv()

# Or use PostgreSQL later:
#SQLALCHEMY_DATABASE_URL=os.getenv("DB_URL")
SQLALCHEMY_DATABASE_URL="postgresql://postgres:user@localhost/capstone"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL # only for SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

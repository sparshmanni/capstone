from database import Base, engine
from models import User

print("⚠️  Dropping all tables...")
Base.metadata.drop_all(bind=engine)

print("🧱 Creating new tables...")
Base.metadata.create_all(bind=engine)

print("✅ Database reset complete with new schema.")

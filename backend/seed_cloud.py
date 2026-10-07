import sys, os
from dotenv import load_dotenv

# Load .env.local from parent directory
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
load_dotenv(env_path)

from app import create_app
from models import db, User
import bcrypt

app = create_app('development')

with app.app_context():
    # Ensure tables are created in the Neon Postgres DB
    db.create_all()
    
    default_pw = "password123"
    hashed = bcrypt.hashpw(default_pw.encode('utf-8'), bcrypt.gensalt(10)).decode("utf-8")
    
    admin_email = "admin@facerec.com"
    user_email = "user@facerec.com"
    
    admin = User.query.filter_by(email=admin_email).first()
    if not admin:
        db.session.add(User(email=admin_email, password_hash=hashed, first_name="Admin", last_name="User", role="admin"))
        print(f"Created Admin: {admin_email} / {default_pw}")
    else:
        admin.password_hash = hashed
        print(f"Updated Admin: {admin_email} / {default_pw}")
        
    user = User.query.filter_by(email=user_email).first()
    if not user:
        db.session.add(User(email=user_email, password_hash=hashed, first_name="Test", last_name="User", role="user"))
        print(f"Created User: {user_email} / {default_pw}")
    else:
        user.password_hash = hashed
        print(f"Updated User: {user_email} / {default_pw}")
        
    db.session.commit()
    print("Database seeding completed!")

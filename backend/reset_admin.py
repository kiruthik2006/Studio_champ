import os
import bcrypt
from app import create_app
from models import db, User

app = create_app('development')
with app.app_context():
    admin = User.query.filter_by(email='admin@facerec.com').first()
    if not admin:
        print("Admin user not found, creating...")
        password_hash = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt(rounds=10)).decode('utf-8')
        admin = User(email='admin@facerec.com', password_hash=password_hash, first_name='Admin', last_name='User', role='admin', is_active=True)
        db.session.add(admin)
    else:
        print("Admin user found, resetting password...")
        admin.password_hash = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt(rounds=10)).decode('utf-8')
    db.session.commit()
    print("Done")

# FaceRec Events - AI-Powered Face Recognition System

FaceRec Events is a complete AI-powered face recognition system that allows users to find their photos from event albums. Users register their face with 3-5 photos, then search event photo galleries to retrieve all pictures containing their face using deep learning.

## Features

- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Face Registration**: Upload 3-5 face photos from different angles for accurate recognition
- **AI-Powered Matching**: Uses DeepFace with Facenet512 model for 512-dimensional face embeddings
- **Event Management**: Create and manage events with bulk photo uploads
- **Photo Discovery**: Instantly find all photos containing your face from any event
- **Quality Scoring**: Automatic photo quality assessment (clarity, sharpness, lighting)
- **Admin Dashboard**: Comprehensive admin panel for system management
- **3D UI Effects**: Modern responsive interface with CSS3 3D transforms and animations

## Technology Stack

### Backend
- **Flask 2.3.3**: Web framework
- **MySQL**: Database with SQLAlchemy ORM
- **DeepFace**: Face recognition library
- **TensorFlow/OpenCV**: Deep learning and image processing
- **Flask-JWT-Extended**: Authentication
- **Bcrypt**: Password hashing

### Frontend
- **HTML5/CSS3**: Modern responsive design
- **JavaScript (ES6+)**: Interactive functionality
- **Font Awesome**: Icons
- **Canvas API**: Animated backgrounds

## Project Structure

```
facerec-events/
├── backend/
│   ├── app.py                 # Flask application factory
│   ├── config.py              # Configuration settings
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # Database models
│   │   └── __init__.py
│   ├── routes/                # API routes
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── photos.py         # Photo management endpoints
│   │   └── admin.py          # Admin endpoints
│   ├── services/              # Business logic
│   │   └── face_recognition.py
│   ├── utils/                 # Utility modules
│   │   ├── image_metadata.py
│   │   └── storage.py
│   └── static/uploads/        # File storage
│       ├── faces/
│       ├── events/
│       └── annotated/
├── frontend/
│   ├── index.html            # Landing page
│   ├── dashboard.html        # User dashboard
│   ├── profile.html          # User profile
│   ├── admin/
│   │   └── dashboard.html    # Admin dashboard
│   ├── css/
│   │   └── style.css         # All styles
│   └── js/
│       ├── auth.js           # AuthManager class
│       ├── main.js           # Landing page JS
│       └── dashboard.js      # Dashboard functionality
└── database/
    └── schema.sql            # MySQL schema
```

## Installation

### Prerequisites
- Python 3.9+
- MySQL 8.0+
- pip

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd facerec-events

# Create virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE facerec_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema
mysql -u root -p facerec_db < database/schema.sql
```

### 3. Configuration

Edit `backend/config.py` to set your database credentials:

```python
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://username:password@localhost/facerec_db'
SECRET_KEY = 'your-secret-key-here'
JWT_SECRET_KEY = 'your-jwt-secret-key-here'
```

Or set environment variables:

```bash
export DATABASE_URL='mysql+pymysql://username:password@localhost/facerec_db'
export SECRET_KEY='your-secret-key'
export JWT_SECRET_KEY='your-jwt-secret'
```

### 4. Run the Application (Easy Method)

Use the provided startup script:

**On macOS/Linux:**
```bash
# Make script executable (first time only)
chmod +x start.sh

# Run the startup script
./start.sh
```

**On Windows:**
```cmd
# Run the batch file
start.bat
```

The script will:
- ✅ Create virtual environment (if needed)
- ✅ Install dependencies
- ✅ Start the backend server (Flask)
- ✅ Start the frontend server (HTTP)
- ✅ Check service health
- ✅ Display access URLs

**Alternative Manual Method:**
```bash
# Terminal 1: Start backend server
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py

# Terminal 2: Start frontend server
cd frontend
python -m http.server 8000
```

**Access the application:**
- Frontend: http://localhost:8000
- Backend API: http://localhost:5001
- Health Check: http://localhost:5001/api/health

### 5. Utility Scripts

The following helper scripts are available:

**Check service status:**
```bash
./status.sh
```

**Stop all services:**
```bash
./stop.sh
```

### 6. Initial Login

Default admin account:
- Email: `admin@facerec.com`
- Password: `admin123`

**Important**: Change the admin password immediately after first login!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Photos
- `POST /api/photos/upload-faces` - Upload face images
- `GET /api/photos/my-faces` - Get user's registered faces
- `DELETE /api/photos/delete-face/<id>` - Delete a face
- `GET /api/photos/events` - List available events
- `POST /api/photos/match` - Find matching photos
- `GET /api/photos/event/<event_id>` - Get event photos
- `GET /api/photos/download/<photo_id>` - Download photo

### Admin
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/events` - List all events
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/<id>` - Update event
- `DELETE /api/admin/events/<id>` - Delete event
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/<id>` - Update user
- `POST /api/admin/upload-event-photos/<event_id>` - Upload photos to event

## Configuration Options

### Face Recognition Settings
Edit in `backend/config.py`:

```python
FACE_DETECTION_MODEL = 'mtcnn'        # Options: mtcnn, opencv, dlib, retinaface
FACE_RECOGNITION_MODEL = 'Facenet512' # Options: VGG-Face, Facenet, Facenet512, etc.
FACE_MATCH_THRESHOLD = 0.65          # Cosine similarity threshold (0-1)
CONFIDENCE_THRESHOLD = 0.85          # Face detection confidence
```

### File Upload Settings
```python
MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
```

## Usage Guide

### For Users

1. **Register**: Create an account with email and password
2. **Upload Faces**: Go to Face Registration tab and upload 3-5 clear photos of yourself
3. **Browse Events**: View available events in the Events tab
4. **Find Photos**: Select an event and click "Find My Photos" to discover all photos with your face
5. **Download**: Click on any photo to view and download it

### For Admins

1. **Login**: Use admin credentials
2. **Dashboard**: View system statistics and recent events
3. **Create Events**: Go to Events tab and create new events
4. **Upload Photos**: Select an event and upload photos in bulk
5. **Manage Users**: View and manage user accounts

## Face Recognition Details

The system uses **DeepFace** with **Facenet512** model to:
- Extract 512-dimensional face embeddings
- Detect faces using MTCNN
- Compare faces using cosine similarity
- Match threshold: 65% similarity

### Best Practices for Face Registration
- Upload 3-5 photos from different angles
- Use clear, well-lit photos
- Face should be clearly visible
- Avoid sunglasses or heavy makeup
- Include different expressions

## Security Features

- Bcrypt password hashing (10 rounds)
- JWT tokens with expiration (access: 1hr, refresh: 30 days)
- CORS protection
- File type and size validation
- SQL injection prevention via SQLAlchemy ORM
- Role-based access control
- Token blacklisting for logout

## Performance Considerations

- Photos are resized to max 2048px dimension before processing
- Face embeddings are cached in database
- Images are processed asynchronously
- Pagination for large photo collections

## Troubleshooting

### Common Issues

**Face detection not working:**
- Ensure photos are clear and well-lit
- Try different detection models in config
- Check OpenCV installation

**Database connection errors:**
- Verify MySQL is running
- Check database credentials
- Ensure database exists

**Module import errors:**
- Activate virtual environment
- Reinstall requirements: `pip install -r requirements.txt`

**CORS errors:**
- Ensure backend is running on port 5000
- Check CORS_ORIGINS in config

## Development

### Running Tests
```bash
cd backend
python -m pytest tests/
```

### Database Migrations
```bash
cd backend
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [DeepFace](https://github.com/serengil/deepface) - Face recognition library
- [Flask](https://flask.palletsprojects.com/) - Web framework
- [FaceNet](https://github.com/davidsandberg/facenet) - Face recognition model

## Support

For support, email support@facerec.com or open an issue in the repository.

---

Built with ❤️ using Flask, DeepFace, and modern web technologies.

# Studio Champ • AI-Powered Event Photography & Biometric Discovery (v2.4)

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![DeepFace](https://img.shields.io/badge/DeepFace-ArcFace%20512--D-FF6F00?logo=tensorflow&logoColor=white)](https://github.com/serengil/deepface)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Studio Champ** is an AI-powered event photography discovery platform. Attendees and clients can discover every photo of themselves and their family circle across thousands of event album photos in seconds using 512-dimensional facial embeddings and multi-person boolean matching.

---

## 🌟 Key Features

### 🧠 Biometric Neural Engine
- **ArcFace / Facenet512 512-D Embeddings**: Deep neural vector representations for millimeter-precise cosine distance matching ($99.2\%+$ accuracy).
- **Family Circles & Multi-Person Filtering**: Search photos containing multiple specific individuals (Boolean `AND` / `OR` group filtering).
- **Vector Health & Quality Scoring**: Real-time multi-angle biometric readiness reports evaluating yaw, pitch, resolution, and illumination quality.
- **Hands-Free Guided Journey**: 4-step automated multi-angle webcam capture flow with live countdowns and posture guidance.

### 🎨 State-of-the-Art Luxury Interface
- **Liquid Sidebar Indicator**: Dynamic water-drop fluid morphing tab tracker with temporal ghost trail motion blur.
- **Google Drive Storage & Auto-Sync**: Radial multi-color circular capacity meter with automatic cloud backup for matched photos.
- **Sequenced Ripple View Transitions**: 4-stage GPU-composited circular mask theme transitions between Champagne Gold Dark and Honey Glacier Light themes.
- **Anti-Banding GPU Dither**: 8-stop cosine-eased gradient ramps paired with a hardware-cached repeating dither pattern for zero color breakage.
- **Spotlight Search (⌘K / Ctrl+K)**: Instant global search across registered circle members, events, and galleries.
- **Lenis Inertial Smooth Scrolling**: Silk-smooth hardware-accelerated momentum scrolling.

### 🛡️ Privacy & Administration
- **Encrypted Vector Storage**: Face representations stored as mathematical vector embeddings.
- **Batch Processing & EXIF Normalization**: Automatic JPEG orientation normalization, metadata indexing, and background task progress tracking.
- **Role-Based Admin Console**: Event manager, multi-photo batch uploader, user directory, and indexing stats.

---

## 🏗️ Architecture & Technology Stack

```
Studio_champ/
├── backend/                  # Flask REST API & Face Recognition Service
│   ├── app.py                # Flask application entry point
│   ├── config.py             # App configuration & CORS settings
│   ├── requirements.txt      # Python dependencies
│   ├── models/               # SQLAlchemy ORM models (User, Face, Event, Photo, Circle)
│   ├── routes/               # Modular REST endpoints (auth, photos, admin)
│   ├── services/             # DeepFace & ArcFace vector computation engine
│   └── utils/                # EXIF metadata parser, storage & diagnostics
├── frontend-react/           # Modern React 19 + Vite Single Page Application
│   ├── src/
│   │   ├── api/              # Axios API client modules
│   │   ├── components/       # Reusable UI & Dashboard components
│   │   │   ├── common/       # Navbar, Footer, LiquidIndicator, Spotlight, Background
│   │   │   ├── dashboard/    # Sidebar, GoogleDriveWidget, Camera, Gallery, Modal
│   │   │   └── admin/        # BatchUploader, EventManager, Stats
│   │   ├── context/          # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/            # LandingPage, DashboardPage, AdminDashboardPage
│   │   └── utils/            # Image loaders, diagnostics, motion blur
│   ├── public/               # High-resolution editorial event photography covers
│   ├── package.json          # Node dependencies & scripts
│   └── vite.config.js        # Vite build & dev server config
├── database/
│   └── schema.sql            # SQLite / MySQL schema definition
├── start.sh                  # One-click startup script (Backend + Frontend)
├── status.sh                 # Health & port check script
├── stop.sh                   # Process termination script
└── .gitignore                # Clean repository rules (excludes caches & local DBs)
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js 18+** and **npm**
- **Python 3.9+** with `pip`
- **macOS / Linux / Windows** (WSL)

### 2. One-Click Launch
The repository includes automated shell scripts to manage both services:

```bash
# Make scripts executable (first time only)
chmod +x start.sh status.sh stop.sh

# Start both Backend (Port 5001) and Frontend (Port 8000)
./start.sh
```

- **Frontend App**: `http://localhost:8000`
- **Backend API**: `http://localhost:5001`
- **Check Status**: `./status.sh`
- **Stop Servers**: `./stop.sh`

---

### 3. Manual Setup (Alternative)

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py                 # Runs Flask on port 5001
```

#### Frontend Setup
```bash
cd frontend-react
npm install
npm run dev -- --port 8000    # Runs Vite dev server on port 8000
```

---

## 🔒 Security & Biometrics Architecture

1. **Face Embeddings**: 512-dimensional floating-point vectors are extracted via ArcFace/Facenet512. Raw images can be removed post-extraction while retaining searchability.
2. **Cosine Similarity Threshold**: Configured at `0.40` distance threshold (corresponding to $\ge 99.2\%$ confidence).
3. **Session Authentication**: JWT Bearer tokens with client-side secure persistence and automatic authorization headers.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

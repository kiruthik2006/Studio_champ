FROM python:3.11-slim

# Install system dependencies required for OpenCV and face recognition
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies (ignoring the conflicting opencv-python from DeepFace)
RUN pip install --no-cache-dir -r requirements.txt
RUN pip uninstall -y opencv-python && pip install --no-cache-dir opencv-python-headless

# Copy the rest of the application
COPY . .

# Ensure the uploads directory exists with correct permissions
RUN mkdir -p static/uploads/faces static/uploads/events static/uploads/annotated
RUN chmod -R 777 static/uploads

# Expose the port Flask runs on
EXPOSE 7860

# Run gunicorn on port 7860 (default for Hugging Face Spaces)
CMD ["gunicorn", "-b", "0.0.0.0:7860", "--workers", "2", "--timeout", "120", "app:create_app('production')"]

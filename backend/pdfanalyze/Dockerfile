FROM python:3.12-slim

# Prevent Python from writing .pyc files and ensure output is not buffered
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies (optional – uncomment if needed for PDF processing)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Copy the requirements file first (to leverage Docker cache)
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Expose the port Django will run on
EXPOSE 8000

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
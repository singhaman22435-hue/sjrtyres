# Use official Python lightweight image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port (AWS App Runner maps to this port)
EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV FLASK_ENV=production

# Run the waitress server
CMD ["python", "app.py"]

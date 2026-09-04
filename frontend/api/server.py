from waitress import serve
from app import app
import logging

if __name__ == '__main__':
    print("🚀 Starting SJR Tyres Production Server (Waitress)")
    print("⚡ Optimized for 2000+ concurrent connections")
    
    # Configure logging for production
    logger = logging.getLogger('waitress')
    logger.setLevel(logging.INFO)
    
    # Serve using Waitress with multiple threads for high concurrency
    serve(app, host='0.0.0.0', port=5000, threads=100, connection_limit=2500)

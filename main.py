import os
import sys

# Ensure backend/app is in Python path for root deployments
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend", "app"))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend"))

from backend.app.main import app

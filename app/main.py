import os
import sys

# Ensure backend/app is in Python path for root deployments
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(root_dir, "backend", "app"))
sys.path.insert(0, os.path.join(root_dir, "backend"))

from backend.app.main import app

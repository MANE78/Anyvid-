import sys
import os

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from app.app import app
import serverless_wsgi

def handler(event, context):
    """
    This function is the entry point for the Netlify Function.
    It uses serverless-wsgi to wrap the Flask app.
    """
    return serverless_wsgi.handle(app, event, context)

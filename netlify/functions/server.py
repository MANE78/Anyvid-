from app import app
import serverless_wsgi

def handler(event, context):
    """
    This function is the entry point for the Netlify Function.
    It uses serverless-wsgi to wrap the Flask app.
    """
    return serverless_wsgi.handle(app, event, context)

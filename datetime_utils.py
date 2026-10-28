"""Date and time helpers using Python's standard library."""
from datetime import datetime

def get_current_date():
    return datetime.now().strftime("%A, %d %B %Y")

def get_current_time():
    return datetime.now().strftime("%I:%M:%S %p")

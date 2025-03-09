import pytest
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

@pytest.fixture(autouse=True)
def setup_test_env():
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)

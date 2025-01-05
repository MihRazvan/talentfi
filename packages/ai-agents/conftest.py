# packages/ai-agents/conftest.py
import pytest
import sys
from pathlib import Path

# Add the src directory to Python path for all tests
@pytest.fixture(autouse=True)
def add_src_to_path():
    src_path = str(Path(__file__).parent / "src")
    if src_path not in sys.path:
        sys.path.append(src_path)
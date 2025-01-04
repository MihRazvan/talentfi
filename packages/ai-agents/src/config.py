# packages/ai-agents/src/config.py
from pydantic import BaseModel
from typing import Dict

class DiscoveryConfig(BaseModel):
    openai_model: str = "gpt-4o-mini"  # Updated to gpt-4o-mini
    github_base_url: str = "https://api.github.com"
    github_api_version: str = "2022-11-28"
    min_requirements: Dict[str, int] = {
        "repos": 3,           # At least 3 repositories
        "followers": 50,      # At least 50 followers
        "account_age_days": 180  # Account at least 6 months old
    }
from pydantic import BaseModel, Field
from typing import Dict, List

class DiscoveryConfig(BaseModel):
    category: str = "developers"
    min_requirements: Dict[str, int] = {
        "repos": 3,
        "followers": 50,
        "account_age_months": 6
    }
    scoring_weights: Dict[str, float] = {
        "code_quality": 0.3,
        "project_impact": 0.3,
        "consistency": 0.2,
        "collaboration": 0.2
    }

class DeveloperProfile(BaseModel):
    username: str
    assessment: List[str]
    confidence_score: int = Field(..., ge=0, le=100)
    category_tags: List[str]
    recommendation: str = Field(..., pattern="^(create_profile|ignore_profile|flag_for_review)$")
    potential_value: float = Field(..., description="Estimated initial token value")
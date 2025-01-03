import httpx
import os
from datetime import datetime
from typing import Dict, Any

class GitHubClient:
    def __init__(self):
        self.api_key = os.getenv("GITHUB_API_KEY")
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {self.api_key}",
            "Accept": "application/vnd.github.v3+json"
        }

    async def get_user_data(self, username: str) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            # Basic user info
            user_response = await client.get(
                f"{self.base_url}/users/{username}",
                headers=self.headers
            )
            user_data = user_response.json()

            # Repos
            repos_response = await client.get(
                f"{self.base_url}/users/{username}/repos",
                headers=self.headers
            )
            repos_data = repos_response.json()

            # Format data
            return {
                "basic_info": {
                    "username": username,
                    "repos": repos_data,
                    "followers": user_data.get("followers", 0),
                    "account_created": user_data.get("created_at"),
                },
                "activity_metrics": {
                    "commit_frequency": await self.get_commit_frequency(username),
                    "project_stars": sum(repo.get("stargazers_count", 0) for repo in repos_data),
                    "contribution_graph": [],  # Implement if needed
                },
                "collaboration_data": {
                    "pull_requests": await self.get_pull_requests(username),
                    "issues": await self.get_issues(username),
                    "discussions": []  # Implement if needed
                }
            }

    async def get_commit_frequency(self, username: str) -> list:
        # Implement commit frequency analysis
        # This is a simplified version
        return []

    async def get_pull_requests(self, username: str) -> list:
        # Implement PR fetching
        return []

    async def get_issues(self, username: str) -> list:
        # Implement issues fetching
        return []
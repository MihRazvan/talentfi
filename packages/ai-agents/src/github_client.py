# packages/ai-agents/src/github_client.py
import httpx
import os
from datetime import datetime
from dotenv import load_dotenv
from typing import Dict, Any, List

class GitHubClient:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("GITHUB_API_KEY")
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }

    async def get_developer_data(self, username: str) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            # Get basic user info
            user_data = await self._get_user_info(client, username)
            if not user_data:
                return None

            # Get repositories
            repos_data = await self._get_user_repos(client, username)
            
            # Get contribution activity
            activity_data = await self._get_contribution_activity(client, username)

            return {
                "basic_info": {
                    "username": username,
                    "name": user_data.get("name"),
                    "bio": user_data.get("bio"),
                    "followers": user_data.get("followers"),
                    "following": user_data.get("following"),
                    "public_repos": user_data.get("public_repos"),
                    "account_created": user_data.get("created_at"),
                },
                "repositories": [{
                    "name": repo["name"],
                    "description": repo["description"],
                    "stars": repo["stargazers_count"],
                    "forks": repo["forks_count"],
                    "languages": await self._get_repo_languages(client, username, repo["name"]),
                    "last_updated": repo["updated_at"]
                } for repo in repos_data[:5]],  # Get details for top 5 repos
                "activity_metrics": {
                    "recent_commits": activity_data.get("total_commits", 0),
                    "languages": activity_data.get("languages", {}),
                    "contribution_streak": activity_data.get("contribution_streak", 0)
                }
            }

    async def _get_user_info(self, client: httpx.AsyncClient, username: str) -> Dict:
        response = await client.get(
            f"{self.base_url}/users/{username}",
            headers=self.headers
        )
        return response.json() if response.status_code == 200 else None

    async def _get_user_repos(self, client: httpx.AsyncClient, username: str) -> List[Dict]:
        response = await client.get(
            f"{self.base_url}/users/{username}/repos?sort=stars&direction=desc",
            headers=self.headers
        )
        return response.json() if response.status_code == 200 else []

    async def _get_repo_languages(self, client: httpx.AsyncClient, username: str, repo: str) -> Dict:
        response = await client.get(
            f"{self.base_url}/repos/{username}/{repo}/languages",
            headers=self.headers
        )
        return response.json() if response.status_code == 200 else {}

    async def _get_contribution_activity(self, client: httpx.AsyncClient, username: str) -> Dict:
        # This is a simplified version - GitHub's API doesn't provide this directly
        # In a real implementation, you might want to analyze commits over time
        return {
            "total_commits": 0,
            "languages": {},
            "contribution_streak": 0
        }
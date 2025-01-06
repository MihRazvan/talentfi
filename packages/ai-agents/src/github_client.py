# packages/ai-agents/src/github_client.py
import httpx
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Dict, Any, List
import asyncio

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
        
        # MVP criteria for developers
        self.min_requirements = {
            "followers": 50,
            "public_repos": 10,
            "account_age_days": 180,  # 6 months
            "min_stars": 100  # At least one repo with 100+ stars
        }

    async def get_developer_data(self, username: str) -> Dict[str, Any]:
        """Get comprehensive developer data from GitHub"""
        async with httpx.AsyncClient() as client:
            # Get basic user info
            user_data = await self._get_user_info(client, username)
            if not user_data:
                return None
                
            # Early return if developer doesn't meet basic criteria
            if not self._meets_basic_criteria(user_data):
                return None

            # Get detailed data
            repos_data = await self._get_user_repos(client, username)
            activity_data = await self._get_contribution_activity(client, username)
            languages_data = await self._get_developer_languages(client, username, repos_data)

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
                    "last_updated": repo["updated_at"],
                    "url": repo["html_url"]
                } for repo in sorted(repos_data, key=lambda x: x["stargazers_count"], reverse=True)[:5]],
                "activity_metrics": {
                    "recent_commits": activity_data.get("total_commits", 0),
                    "languages": languages_data,
                    "contribution_streak": activity_data.get("contribution_streak", 0)
                }
            }

    def _meets_basic_criteria(self, user_data: Dict[str, Any]) -> bool:
        """Check if developer meets minimum requirements"""
        if not user_data:
            return False
            
        # Check followers
        if user_data.get("followers", 0) < self.min_requirements["followers"]:
            return False
            
        # Check repos
        if user_data.get("public_repos", 0) < self.min_requirements["public_repos"]:
            return False
            
        # Check account age
        created_at = datetime.strptime(user_data.get("created_at", ""), "%Y-%m-%dT%H:%M:%SZ")
        account_age = datetime.now() - created_at
        if account_age.days < self.min_requirements["account_age_days"]:
            return False
            
        return True

    async def _get_user_info(self, client: httpx.AsyncClient, username: str) -> Dict:
        """Get basic user information"""
        response = await client.get(
            f"{self.base_url}/users/{username}",
            headers=self.headers
        )
        if response.status_code == 200:
            return response.json()
        return None

    async def _get_user_repos(self, client: httpx.AsyncClient, username: str) -> List[Dict]:
        """Get user repositories sorted by stars"""
        response = await client.get(
            f"{self.base_url}/users/{username}/repos?sort=stars&direction=desc&per_page=100",
            headers=self.headers
        )
        if response.status_code == 200:
            return response.json()
        return []

    async def _get_repo_languages(self, client: httpx.AsyncClient, username: str, repo: str) -> Dict:
        """Get language breakdown for a repository"""
        response = await client.get(
            f"{self.base_url}/repos/{username}/{repo}/languages",
            headers=self.headers
        )
        if response.status_code == 200:
            return response.json()
        return {}

    async def _get_developer_languages(self, client: httpx.AsyncClient, username: str, repos: List[Dict]) -> Dict[str, int]:
        """Get aggregated language statistics across all repositories"""
        languages = {}
        for repo in repos:
            repo_languages = await self._get_repo_languages(client, username, repo["name"])
            for lang, bytes in repo_languages.items():
                languages[lang] = languages.get(lang, 0) + bytes
        return languages

    async def _get_contribution_activity(self, client: httpx.AsyncClient, username: str) -> Dict:
        """Get recent contribution activity"""
        # Note: This is a simplified version since GitHub's API doesn't provide this directly
        recent_commits = 0
        contribution_streak = 0
        
        # Get events to estimate activity
        response = await client.get(
            f"{self.base_url}/users/{username}/events",
            headers=self.headers
        )
        
        if response.status_code == 200:
            events = response.json()
            # Count push events in the last 30 days
            thirty_days_ago = datetime.now() - timedelta(days=30)
            
            for event in events:
                if event["type"] == "PushEvent":
                    event_date = datetime.strptime(event["created_at"], "%Y-%m-%dT%H:%M:%SZ")
                    if event_date > thirty_days_ago:
                        recent_commits += len(event.get("payload", {}).get("commits", []))
        
        return {
            "total_commits": recent_commits,
            "contribution_streak": contribution_streak
        }
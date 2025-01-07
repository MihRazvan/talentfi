# packages/ai-agents/src/github_client.py
import httpx
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Dict, Any, List, Set
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

    async def discover_web3_developers(self, limit: int = 10) -> List[str]:
        developers: Set[str] = set()
        queries = [
            "language:solidity followers:>500 type:user",
            "ethereum language:solidity stars:>100 type:user",
            "web3 solidity followers:>200 type:user",
            "web3 smart-contracts stars:>100 type:user",
            "blockchain solidity contributions:>100 type:user"
        ]

        async with httpx.AsyncClient(timeout=30.0) as client:
            for query in queries:
                response = await client.get(
                    f"{self.base_url}/search/users",
                    params={
                        "q": query,
                        "sort": "followers",
                        "order": "desc",
                        "per_page": 50
                    },
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    users = response.json().get("items", [])
                    for user in users:
                        if await self._is_quality_developer(client, user["login"]):
                            developers.add(user["login"])
                            if len(developers) >= limit:
                                break
                await asyncio.sleep(1)
                            
        return list(developers)[:limit]

    async def _is_quality_developer(self, client: httpx.AsyncClient, username: str) -> bool:
        response = await client.get(
            f"{self.base_url}/users/{username}/repos",
            headers=self.headers,
            params={"sort": "stars", "per_page": 30}
        )
        
        if response.status_code != 200:
            return False
            
        repos = response.json()
        has_solidity = False
        total_stars = 0
        
        for repo in repos:
            language = repo.get("language", "")
            if language and "solidity" in language.lower():
                has_solidity = True
            total_stars += repo.get("stargazers_count", 0)
        
        return has_solidity and total_stars > 100 

    async def get_developer_data(self, username: str) -> Dict[str, Any]:
        """Get comprehensive developer data"""
        async with httpx.AsyncClient() as client:
            user_data = await self._get_user_info(client, username)
            if not user_data:
                return None
                
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
import httpx
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Dict, Any, List, Set
import asyncio
import random

class GitHubClient:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("GITHUB_API_KEY")
        if not self.api_key:
            raise Exception("GITHUB_API_KEY not found in environment variables")
            
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
        self.client_timeout = httpx.Timeout(30.0)

    async def _make_github_request(self, client: httpx.AsyncClient, url: str, params: Dict = None) -> Dict:
        """Helper method for making GitHub API requests with rate limit handling"""
        try:
            response = await client.get(url, params=params, headers=self.headers)
            if response.status_code == 403 and 'X-RateLimit-Remaining' in response.headers:
                remaining = int(response.headers['X-RateLimit-Remaining'])
                if remaining == 0:
                    reset_time = int(response.headers['X-RateLimit-Reset'])
                    wait_time = reset_time - int(datetime.now().timestamp()) + 1
                    print(f"Rate limit exceeded. Waiting {wait_time} seconds...")
                    await asyncio.sleep(min(wait_time, 60))
                    return await self._make_github_request(client, url, params)
            
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            print(f"HTTP error {e.response.status_code} for {url}: {str(e)}")
            return None
        except Exception as e:
            print(f"Error making request to {url}: {str(e)}")
            return None

    async def discover_web3_developers(self, limit: int = 10) -> List[str]:
        """Discover individual web3 developers with expanded search criteria"""
        developers: Set[str] = set()
        
        # More diverse search queries
        queries = [
            # Core Solidity developers
            "language:solidity type:user followers:>50",
            "ethereum solidity type:user stars:>50",
            
            # Active web3 contributors
            "web3 solidity type:user",
            "smart contracts language:solidity type:user",
            
            # Recent activity focus
            "blockchain created:>2023-01-01 language:solidity type:user",
            "defi language:solidity type:user",
            
            # Specific frameworks/tools
            "hardhat foundry type:user language:solidity",
            "openzeppelin type:user language:solidity"
        ]
        
        # Randomize queries for variety
        random.shuffle(queries)

        async with httpx.AsyncClient(timeout=self.client_timeout) as client:
            for query in queries:
                if len(developers) >= limit:
                    break
                
                # Use different sort orders for variety
                sort_options = ["followers", "repositories", "joined"]
                response_data = await self._make_github_request(
                    client,
                    f"{self.base_url}/search/users",
                    params={
                        "q": query,
                        "sort": random.choice(sort_options),
                        "order": random.choice(["desc", "asc"]),
                        "per_page": 30
                    }
                )
                
                if response_data and "items" in response_data:
                    for user in response_data["items"]:
                        if len(developers) >= limit:
                            break
                            
                        username = user["login"]
                        if await self._is_quality_developer(client, username):
                            developers.add(username)
                            print(f"Found promising developer: {username}")
                    
                await asyncio.sleep(2)  # Rate limiting
                            
        return list(developers)[:limit]

    async def _is_quality_developer(self, client: httpx.AsyncClient, username: str) -> bool:
        """Enhanced check for quality web3 developers"""
        try:
            # Get user info
            user_data = await self._make_github_request(client, f"{self.base_url}/users/{username}")
            if not user_data:
                return False
                
            # Filter out organizations
            if user_data.get("type") != "User":
                return False
            
            # Check for company indicators
            name = (user_data.get("name") or "").lower()
            bio = (user_data.get("bio") or "").lower()
            company = (user_data.get("company") or "").lower()
            
            company_indicators = ["inc", "ltd", "corp", "organization", "foundation"]
            if any(indicator in name or indicator in company for indicator in company_indicators):
                return False
            
            # Get repositories
            repos_data = await self._make_github_request(
                client,
                f"{self.base_url}/users/{username}/repos",
                params={"sort": "updated", "per_page": 30}
            )
            
            if not repos_data:
                return False
            
            score = 0
            recent_activity = False
            solidity_repos = 0
            total_stars = 0
            
            for repo in repos_data:
                # Check if repo was updated recently
                update_time = datetime.strptime(repo["updated_at"], "%Y-%m-%dT%H:%M:%SZ")
                if update_time > datetime.now() - timedelta(days=180):
                    recent_activity = True
                
                # Language check
                lang = (repo.get("language") or "").lower()
                if lang == "solidity":
                    solidity_repos += 1
                    score += 2
                
                # Star count
                stars = repo.get("stargazers_count", 0)
                total_stars += stars
                if stars > 100:
                    score += 2
                elif stars > 50:
                    score += 1
                
                # Web3 indicators in description or topics
                desc = (repo.get("description") or "").lower()
                topics = [t.lower() for t in repo.get("topics", [])]
                
                web3_keywords = ["ethereum", "web3", "blockchain", "defi", "smart contract"]
                if any(kw in desc or kw in topics for kw in web3_keywords):
                    score += 1
            
            # Quality criteria
            has_enough_stars = total_stars > 50
            is_active = recent_activity
            has_solidity = solidity_repos > 0
            
            return (has_solidity or score >= 3) and is_active and has_enough_stars
            
        except Exception as e:
            print(f"Error checking developer quality for {username}: {str(e)}")
            return False

    async def get_developer_data(self, username: str) -> Dict[str, Any]:
        """Get comprehensive developer data with better error handling"""
        try:
            async with httpx.AsyncClient(timeout=self.client_timeout) as client:
                user_data = await self._make_github_request(client, f"{self.base_url}/users/{username}")
                if not user_data:
                    return None
                    
                repos_data = await self._make_github_request(
                    client,
                    f"{self.base_url}/users/{username}/repos",
                    params={"sort": "stars", "direction": "desc", "per_page": 100}
                ) or []

                # Process top repositories
                top_repos = []
                for repo in sorted(repos_data, key=lambda x: x.get("stargazers_count", 0), reverse=True)[:5]:
                    languages = await self._get_repo_languages(client, username, repo["name"])
                    
                    top_repos.append({
                        "name": repo.get("name", ""),
                        "description": repo.get("description", ""),
                        "stars": repo.get("stargazers_count", 0),
                        "forks": repo.get("forks_count", 0),
                        "languages": languages,
                        "last_updated": repo.get("updated_at", ""),
                        "url": repo.get("html_url", "")
                    })

                # Get activity data
                activity_data = await self._get_contribution_activity(client, username)
                languages_data = await self._aggregate_languages(client, username, repos_data)

                return {
                    "basic_info": {
                        "username": username,
                        "name": user_data.get("name", ""),
                        "bio": user_data.get("bio", ""),
                        "followers": user_data.get("followers", 0),
                        "following": user_data.get("following", 0),
                        "public_repos": user_data.get("public_repos", 0),
                        "account_created": user_data.get("created_at"),
                    },
                    "repositories": top_repos,
                    "activity_metrics": {
                        "recent_commits": activity_data.get("total_commits", 0),
                        "languages": languages_data,
                        "contribution_streak": activity_data.get("contribution_streak", 0)
                    }
                }
        except Exception as e:
            print(f"Error getting developer data for {username}: {str(e)}")
            return None

    async def _get_repo_languages(self, client: httpx.AsyncClient, username: str, repo: str) -> Dict[str, int]:
        """Get language breakdown for a repository"""
        return await self._make_github_request(
            client,
            f"{self.base_url}/repos/{username}/{repo}/languages"
        ) or {}

    async def _aggregate_languages(self, client: httpx.AsyncClient, username: str, repos: List[Dict]) -> Dict[str, int]:
        """Get aggregated language statistics across all repositories"""
        languages = {}
        for repo in repos:
            repo_languages = await self._get_repo_languages(client, username, repo.get("name", ""))
            for lang, bytes in repo_languages.items():
                languages[lang] = languages.get(lang, 0) + bytes
        return languages

    async def _get_contribution_activity(self, client: httpx.AsyncClient, username: str) -> Dict:
        """Get recent contribution activity with better metrics"""
        try:
            events_data = await self._make_github_request(
                client,
                f"{self.base_url}/users/{username}/events",
                params={"per_page": 100}
            ) or []
            
            recent_commits = 0
            contribution_days = set()
            thirty_days_ago = datetime.now() - timedelta(days=30)
            
            for event in events_data:
                if event["type"] in ["PushEvent", "PullRequestEvent", "IssuesEvent"]:
                    event_date = datetime.strptime(event["created_at"], "%Y-%m-%dT%H:%M:%SZ")
                    if event_date > thirty_days_ago:
                        if event["type"] == "PushEvent":
                            recent_commits += len(event.get("payload", {}).get("commits", []))
                        contribution_days.add(event_date.date())
            
            return {
                "total_commits": recent_commits,
                "contribution_streak": len(contribution_days)
            }
        except Exception as e:
            print(f"Error getting contribution activity for {username}: {str(e)}")
            return {
                "total_commits": 0,
                "contribution_streak": 0
            }
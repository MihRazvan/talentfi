# packages/ai-agents/src/test_github.py
import asyncio
from github_client import GitHubClient
import json

async def test_github_data():
    client = GitHubClient()
    # Test with a known GitHub username
    data = await client.get_developer_data("MihRazvan")
    
    # Pretty print the results
    print(json.dumps(data, indent=2))

if __name__ == "__main__":
    asyncio.run(test_github_data())
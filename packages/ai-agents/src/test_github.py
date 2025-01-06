# packages/ai-agents/src/test_github.py
import asyncio
from github_client import GitHubClient
import json

async def test_github_data():
    client = GitHubClient()
    
    # Test with known GitHub usernames with strong developer profiles
    test_usernames = [
        "samczsun",    # Known solidity security researcher
        "gakonst",     # Foundry creator
        "Arachnid",    # ENS developer
    ]
    
    print("Testing GitHub API Integration...")
    print("=================================")
    
    for username in test_usernames:
        print(f"\nFetching data for {username}...")
        try:
            data = await client.get_developer_data(username)
            if data:
                print("\nBasic Info:")
                print(f"Name: {data['basic_info']['name']}")
                print(f"Followers: {data['basic_info']['followers']}")
                print(f"Public Repos: {data['basic_info']['public_repos']}")
                
                print("\nTop Repositories:")
                for repo in data['repositories'][:3]:
                    print(f"- {repo['name']}: {repo['stars']} stars")
                    if repo['languages']:
                        print(f"  Languages: {', '.join(repo['languages'].keys())}")
                
            else:
                print(f"No data found for {username}")
                
        except Exception as e:
            print(f"Error fetching data for {username}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_github_data())
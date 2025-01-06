# packages/ai-agents/src/test_analyzer.py
import asyncio
from github_client import GitHubClient
from ai_analyzer import DeveloperAnalyzer
import json

async def test_analysis():
    try:
        # Initialize clients
        gh_client = GitHubClient()
        analyzer = DeveloperAnalyzer()
        
        # Test with known web3 developers
        test_developers = ["gakonst", "samczsun"]
        
        for username in test_developers:
            print(f"\nAnalyzing {username}...")
            
            # Get GitHub data
            dev_data = await gh_client.get_developer_data(username)
            
            if not dev_data:
                print(f"Could not fetch data for {username}")
                continue
            
            print(f"Found developer data for {username}")
            print(f"Followers: {dev_data['basic_info']['followers']}")
            print(f"Public repos: {dev_data['basic_info']['public_repos']}")
            print("\nTop repositories:")
            for repo in dev_data['repositories'][:3]:
                print(f"- {repo['name']}: {repo['stars']} stars")
            
            # Analyze data
            print("\nPerforming AI analysis...")
            analysis = analyzer.analyze_developer(dev_data)
            
            if analysis:
                print("\nAnalysis results:")
                print(json.dumps(analysis, indent=2))
            else:
                print("Analysis failed")

    except Exception as e:
        print(f"Test failed with error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_analysis())
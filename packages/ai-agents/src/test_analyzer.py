# packages/ai-agents/src/test_analyzer.py
import asyncio
from github_client import GitHubClient
from ai_analyzer import DeveloperAnalyzer
import json

async def test_analysis():
    try:
        # Get GitHub data
        gh_client = GitHubClient()
        developer_data = await gh_client.get_developer_data("MihRazvan")
        
        # Analyze data
        analyzer = DeveloperAnalyzer()
        analysis = await analyzer.analyze_developer(developer_data)
        
        if analysis:
            print("\nAI Analysis Results:")
            print(json.dumps(analysis, indent=2))  # Just dump once since analysis is already a dict
        else:
            print("Analysis failed to produce results.")

    except Exception as e:
        print(f"Error in test: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_analysis())
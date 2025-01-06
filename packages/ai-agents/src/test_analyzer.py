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
        
        # Test developers
        developers = ["gakonst"]  # Testing with one known web3 developer
        
        for dev in developers:
            print(f"\nAnalyzing {dev}...")
            
            # Get GitHub data
            dev_data = await gh_client.get_developer_data(dev)
            
            if dev_data:
                # Analyze developer
                analysis = analyzer.analyze_developer(dev_data)
                
                if analysis:
                    print("\nAnalysis Results:")
                    print(json.dumps(analysis, indent=2))
                    
                    # Print key metrics
                    print("\nKey Metrics:")
                    print(f"Confidence Score: {analysis['confidence_score']}/100")
                    print(f"Web3 Skill Level: {analysis['web3_skill_level']}")
                    print(f"Recommendation: {analysis['recommendation']}")
                    
                    if analysis['recommendation'] == 'create_profile':
                        print("\nInvestment Thesis:")
                        for point in analysis['investment_thesis']:
                            print(f"- {point}")
                else:
                    print("Analysis failed")
            else:
                print(f"Could not fetch data for {dev}")

    except Exception as e:
        print(f"Error in test: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_analysis())
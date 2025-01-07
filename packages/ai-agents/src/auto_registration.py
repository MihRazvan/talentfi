import asyncio
from github_client import GitHubClient
from ai_analyzer import EnhancedDeveloperAnalyzer
from contract_integrator import EnhancedContractIntegrator
from eth_account import Account
import json
from datetime import datetime

class AutoRegistrationAgent:
    def __init__(self):
        self.github = GitHubClient()
        self.analyzer = EnhancedDeveloperAnalyzer()
        self.contract = EnhancedContractIntegrator()
        
        self.min_confidence_score = 65  # Lowered threshold to include more developers
        self.max_registrations = 5
        
    async def discover_and_register(self):
        print("Starting developer discovery and registration process...")
        
        try:
            # Discover potential developers
            potential_developers = await self.github.discover_web3_developers(limit=20)
            print(f"Found {len(potential_developers)} potential developers\n")
            
            print("Developer Evaluation Criteria:")
            print(f"- Minimum confidence score: {self.min_confidence_score}")
            print(f"- Maximum registrations: {self.max_registrations}\n")
            
            registrations = 0
            results = []
            
            for username in potential_developers:
                if registrations >= self.max_registrations:
                    break
                    
                print(f"\nAnalyzing {username}...")
                
                try:
                    # Check if already registered
                    is_registered = await self.contract.check_if_registered(username)
                    if is_registered:
                        print(f"{username} is already registered")
                        continue
                    
                    # Get GitHub data
                    dev_data = await self.github.get_developer_data(username)
                    if not dev_data:
                        print(f"Could not fetch data for {username}")
                        continue
                    
                    # Analyze developer
                    analysis = await self.analyzer.analyze_developer(dev_data)
                    if not analysis:
                        print(f"Could not analyze {username}")
                        continue
                    
                    print(f"\nAnalysis complete for {username}:")
                    print(f"Confidence Score: {analysis['confidence_score']}")
                    print(f"Skill Relevance: {analysis['skills_assessment']['skill_relevance_score']}")
                    print("Validated Skills:", ", ".join(analysis['skills_assessment'].get('validated_skills', [])[:5]))
                    
                    if analysis['confidence_score'] >= self.min_confidence_score:
                        print(f"\n{username} meets criteria. Attempting registration...")
                        
                        # Register developer
                        result = await self.contract.register_developer(
                            username,
                            analysis
                        )
                        
                        if result['success']:
                            print(f"Successfully registered {username}")
                            registrations += 1
                            
                            results.append({
                                'username': username,
                                'developer_address': result['developer_address'],
                                'token_address': result['token_address'],
                                'analysis': analysis,
                                'transaction_hash': result['transaction_hash']
                            })
                        else:
                            print(f"Failed to register {username}: {result.get('error')}")
                    else:
                        print(f"\n{username} does not meet minimum criteria")
                        print(f"Score {analysis['confidence_score']} below threshold {self.min_confidence_score}")
                        
                except Exception as e:
                    print(f"Error processing {username}: {str(e)}")
                    continue
            
            # Print summary
            print("\n=== Registration Summary ===")
            print(f"Total developers analyzed: {len(potential_developers)}")
            print(f"Successful registrations: {len(results)}")
            
            if results:
                # Save detailed results
                output = {
                    'timestamp': datetime.now().isoformat(),
                    'registrations': results,
                    'summary': {
                        'total_attempted': len(potential_developers),
                        'successful': len(results),
                        'average_confidence': sum(r['analysis']['confidence_score'] for r in results) / len(results) if results else 0
                    }
                }
                
                with open('registration_results.json', 'w') as f:
                    json.dump(output, f, indent=2, default=str)
            
            return results

        except Exception as e:
            print(f"Error in discover_and_register: {str(e)}")
            return []

async def main():
    agent = AutoRegistrationAgent()
    await agent.discover_and_register()

if __name__ == "__main__":
    asyncio.run(main())
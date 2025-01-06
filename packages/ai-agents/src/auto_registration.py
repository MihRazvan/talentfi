# packages/ai-agents/src/auto_registration.py
import asyncio
from github_client import GitHubClient
from ai_analyzer import DeveloperAnalyzer
from contract_integrator import ContractIntegrator
from eth_account import Account
import json

class AutoRegistrationAgent:
    def __init__(self):
        self.github = GitHubClient()
        self.analyzer = DeveloperAnalyzer()
        self.contract = ContractIntegrator()
        
        self.min_confidence_score = 75
        self.max_registrations = 3
        
    async def discover_and_register(self):
        print("Starting developer discovery and registration process...")
        
        # Dynamically discover developers
        potential_developers = await self.github.discover_web3_developers(limit=10)
        print(f"Found {len(potential_developers)} potential developers")
        
        registrations = 0
        results = []
        
        for username in potential_developers:
            if registrations >= self.max_registrations:
                break
                
            print(f"\nAnalyzing {username}...")
            
            # Skip if already registered
            if self.contract.check_if_registered(username):
                print(f"{username} is already registered")
                continue
            
            # Get GitHub data
            dev_data = await self.github.get_developer_data(username)
            if not dev_data:
                print(f"Could not fetch data for {username}")
                continue
            
            # Analyze developer
            analysis = self.analyzer.analyze_developer(dev_data)
            if not analysis:
                print(f"Could not analyze {username}")
                continue
            
            print(f"Analysis complete for {username}")
            print(f"Confidence Score: {analysis['confidence_score']}")
            print(f"Web3 Skill Level: {analysis['web3_skill_level']}")
            
            if analysis['confidence_score'] >= self.min_confidence_score:
                print(f"{username} meets criteria. Attempting registration...")
                
                token_name = f"{username}Token"
                token_symbol = f"${username[:4].upper()}"
                
                developer_key = Account.create()
                developer_address = developer_key.address
                
                result = self.contract.register_developer(
                    username,
                    developer_address,
                    token_name,
                    token_symbol
                )
                
                if result['success']:
                    print(f"Successfully registered {username}")
                    registrations += 1
                    results.append({
                        'username': username,
                        'developer_address': developer_address,
                        'token_address': result['token_address'],
                        'analysis': analysis
                    })
                else:
                    print(f"Failed to register {username}: {result.get('error')}")
            else:
                print(f"{username} does not meet minimum criteria")
        
        if results:
            with open('registration_results.json', 'w') as f:
                json.dump(results, f, indent=2)
            print(f"\nRegistered {len(results)} developers successfully")
        
        return results

async def main():
    agent = AutoRegistrationAgent()
    await agent.discover_and_register()

if __name__ == "__main__":
    asyncio.run(main())
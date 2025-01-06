# packages/ai-agents/src/auto_registration.py
from github_client import GitHubClient
from ai_analyzer import DeveloperAnalyzer
from contract_integrator import ContractIntegrator
from eth_account import Account
import json
import asyncio
import os
from dotenv import load_dotenv

class AutoRegistrationAgent:
    def __init__(self):
        self.github = GitHubClient()
        self.analyzer = DeveloperAnalyzer()
        self.contract = ContractIntegrator()
        
        # Parameters for token creation
        self.min_confidence_score = 75  # Minimum score to create a profile
        self.max_registrations = 3      # Maximum number of registrations per run

    async def discover_and_register(self):
        """Main function to discover and register developers"""
        print("Starting developer discovery and registration process...")
        
        # Initial list of promising developers to scan
        potential_developers = [
            "gakonst",
            "samczsun",
            "frangio", 
            "Arachnid",
            "noxx3xxon",
            "pcaversaccio"
        ]
        
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
            
            # Check if developer meets criteria
            if analysis['confidence_score'] >= self.min_confidence_score:
                print(f"{username} meets criteria. Attempting registration...")
                
                # Generate token details
                token_name = f"{username}Token"
                token_symbol = f"${username[:4].upper()}"
                
                # Generate deterministic address for developer
                developer_key = Account.create()
                developer_address = developer_key.address
                
                # Register developer
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
        
        # Save results
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
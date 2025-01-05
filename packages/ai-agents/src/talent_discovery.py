# packages/ai-agents/src/talent_discovery.py
from typing import List, Dict, Any
from github_client import GitHubClient
from ai_analyzer import DeveloperAnalyzer
import asyncio
import json
import os
from datetime import datetime

class TalentDiscoveryService:
    def __init__(self):
        self.github_client = GitHubClient()
        self.analyzer = DeveloperAnalyzer()
        self.discovered_file = "discovered_developers.json"

    def load_discovered_developers(self) -> Dict[str, Any]:
        """Load previously discovered developers to avoid duplicates"""
        if os.path.exists(self.discovered_file):
            with open(self.discovered_file, 'r') as f:
                return json.load(f)
        return {}

    def save_discovered_developers(self, data: Dict[str, Any]):
        """Save newly discovered developers"""
        with open(self.discovered_file, 'w') as f:
            json.dump(data, f, indent=2)

    async def discover_developers(self, max_discoveries: int = 3) -> List[Dict[str, Any]]:
        """Find and analyze new promising developers"""
        discovered = self.load_discovered_developers()
        new_discoveries = []
        
        # Initial list of promising developers to analyze
        potential_developers = [
            "vbuterin",    # Ethereum
            "gakonst",     # Foundry creator
            "samczsun",    # Smart contract security
            "frangio",     # OpenZeppelin
            "Arachnid"     # ENS
            # Add more potential developers
        ]

        for username in potential_developers:
            if len(new_discoveries) >= max_discoveries:
                break
                
            if username in discovered:
                continue

            try:
                # Get developer data
                dev_data = await self.github_client.get_developer_data(username)
                if not dev_data:
                    continue

                # Analyze developer
                analysis = self.analyzer.analyze_developer(dev_data)
                if not analysis:
                    continue

                # Check if developer meets criteria
                if analysis['confidence_score'] >= 75 and analysis['recommendation'] == 'create_profile':
                    discovery = {
                        'github_data': dev_data,
                        'analysis': analysis,
                        'discovery_time': datetime.now().isoformat()
                    }
                    
                    new_discoveries.append(discovery)
                    discovered[username] = discovery

            except Exception as e:
                print(f"Error processing {username}: {str(e)}")
                continue

        # Save updated discoveries
        self.save_discovered_developers(discovered)
        return new_discoveries

    async def get_registration_data(self, discovery: Dict[str, Any]) -> Dict[str, Any]:
        """Format discovery data for smart contract registration"""
        username = discovery['github_data']['basic_info']['username']
        return {
            'username': username,
            'token_name': f"{username} Token",
            'token_symbol': f"${username[:4].upper()}",
            'initial_score': discovery['analysis']['confidence_score'],
            'category_tags': discovery['analysis']['category_tags'],
            'investment_thesis': discovery['analysis']['investment_thesis']
        }

async def main():
    service = TalentDiscoveryService()
    discoveries = await service.discover_developers()
    print(f"Discovered {len(discoveries)} new developers:")
    print(json.dumps(discoveries, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
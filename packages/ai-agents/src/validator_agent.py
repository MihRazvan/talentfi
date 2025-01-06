# packages/ai-agents/src/validator_agent.py
from github_client import GitHubClient
from ai_analyzer import DeveloperAnalyzer
from contract_integrator import ContractIntegrator
from eth_account import Account
import json
from typing import Dict, Any

class ValidatorAgent:
    def __init__(self):
        self.github = GitHubClient()
        self.analyzer = DeveloperAnalyzer()
        self.contract = ContractIntegrator()
        self.min_confidence_score = 75

    async def validate_user(self, github_username: str, wallet_address: str) -> Dict[str, Any]:
        # Check if already registered
        if self.contract.check_if_registered(github_username):
            return {
                "valid": False,
                "reason": "Profile already exists",
                "can_claim": True
            }

        # Get GitHub data
        dev_data = await self.github.get_developer_data(github_username)
        if not dev_data:
            return {
                "valid": False,
                "reason": "Could not fetch GitHub data",
                "can_claim": False
            }

        # Analyze developer
        analysis = self.analyzer.analyze_developer(dev_data)
        if not analysis:
            return {
                "valid": False,
                "reason": "Could not analyze profile",
                "can_claim": False
            }

        is_valid = analysis['confidence_score'] >= self.min_confidence_score

        if is_valid:
            # Register developer
            token_name = f"{github_username}Token"
            token_symbol = f"${github_username[:4].upper()}"
            
            result = self.contract.register_developer(
                github_username,
                wallet_address,
                token_name,
                token_symbol
            )

            if not result['success']:
                return {
                    "valid": False,
                    "reason": f"Registration failed: {result.get('error')}",
                    "can_claim": False
                }

        return {
            "valid": is_valid,
            "analysis": analysis,
            "reason": "Profile validated and registered" if is_valid else "Does not meet criteria",
            "can_claim": False
        }

# Quick test
async def test_validator():
    validator = ValidatorAgent()
    result = await validator.validate_user("vbuterin", "0x1234...")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_validator())
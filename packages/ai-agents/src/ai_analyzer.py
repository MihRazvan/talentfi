from openai import AsyncOpenAI
import os
from dotenv import load_dotenv
from typing import Dict, Any, List
import json

class EnhancedDeveloperAnalyzer:
    def __init__(self):
        load_dotenv()
        self.client = AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.model = "gpt-4-0125-preview"

    def _create_skill_tags(self, repositories: List[Dict]) -> List[str]:
        """Extract relevant skills from repositories"""
        try:
            skills = set()
            
            for repo in repositories:
                if not repo.get("languages"):
                    continue
                    
                for lang in repo.get("languages", {}).keys():
                    if lang:  # Ensure lang is not None
                        skills.add(lang.lower())
                
                # Extract frameworks and technologies from description
                desc = (repo.get("description") or "").lower()
                common_techs = {
                    "solidity", "ethereum", "web3", "blockchain", 
                    "smart contracts", "defi", "nft"
                }
                skills.update(tech for tech in common_techs if tech in desc)
            
            return list(skills)
        except Exception as e:
            print(f"Error in _create_skill_tags: {str(e)}")
            return []

    def _calculate_initial_reputation(self, dev_data: Dict[str, Any]) -> int:
        """Calculate initial reputation score"""
        try:
            base_score = 0
            
            # Followers impact
            followers = dev_data.get('basic_info', {}).get('followers', 0)
            base_score += min(followers // 10, 100)
            
            # Repository stars impact
            total_stars = sum(repo.get('stars', 0) for repo in dev_data.get('repositories', []))
            base_score += min(total_stars // 50, 200)
            
            # Contribution activity impact
            recent_commits = dev_data.get('activity_metrics', {}).get('recent_commits', 0)
            base_score += min(recent_commits // 5, 50)
            
            return base_score
        except Exception as e:
            print(f"Error in _calculate_initial_reputation: {str(e)}")
            return 0

    def _create_analysis_prompt(self, dev_data: Dict[str, Any]) -> str:
        try:
            if not dev_data or 'basic_info' not in dev_data:
                raise ValueError("Invalid developer data format")

            # Extract skills safely
            skills = self._create_skill_tags(dev_data.get("repositories", []))
            initial_reputation = self._calculate_initial_reputation(dev_data)
            
            basic_info = dev_data['basic_info']
            return f"""Analyze this developer's profile for talent discovery, focusing on web3/blockchain potential:

PROFILE:
Username: {basic_info.get('username', 'Unknown')}
Name: {basic_info.get('name', 'Unknown')}
Bio: {basic_info.get('bio', 'No bio available')}
Followers: {basic_info.get('followers', 0)}
Initial Reputation Score: {initial_reputation}
Identified Skills: {', '.join(skills) if skills else 'None identified'}

REPOSITORIES:
{chr(10).join([f'- {repo.get("name", "Unknown")}: {repo.get("stars", 0)} stars\n  Description: {repo.get("description", "N/A")}\n  Languages: {", ".join(repo.get("languages", {}).keys()) if repo.get("languages") else "N/A"}' for repo in dev_data.get("repositories", [])])}

Please analyze this developer's potential and provide a response in JSON format with the following fields:
- confidence_score: number from 0-100
- skills_assessment: {{
    "validated_skills": array of strings,
    "missing_critical_skills": array of strings,
    "skill_relevance_score": number from 1-10
}}
- market_metrics: {{
    "growth_potential": number from 1-10,
    "suggested_initial_price": string (in wei),
    "suggested_token_name": string,
    "suggested_token_symbol": string
}}
- investment_thesis: array of strings (why invest in this developer?)
- risk_factors: array of strings"""

        except Exception as e:
            print(f"Error in _create_analysis_prompt: {str(e)}")
            raise

    async def analyze_developer(self, dev_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            if not dev_data:
                print("Developer data is None")
                return None
                
            analysis_prompt = self._create_analysis_prompt(dev_data)
            
            completion = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an AI talent scout analyzing developer profiles for web3/blockchain potential. Focus on evidence of real development skills and contributions."
                    },
                    {
                        "role": "user", 
                        "content": analysis_prompt
                    }
                ],
                response_format={ "type": "json_object" }
            )
            
            analysis = json.loads(completion.choices[0].message.content)
            
            # Add metadata
            analysis["analyzed_at"] = dev_data["basic_info"].get("account_created")
            analysis["github_url"] = f"https://github.com/{dev_data['basic_info'].get('username')}"
            analysis["initial_skills"] = self._create_skill_tags(dev_data.get("repositories", []))
            
            return analysis

        except Exception as e:
            print(f"Error in analyze_developer: {str(e)}")
            return None

# For backward compatibility
DeveloperAnalyzer = EnhancedDeveloperAnalyzer
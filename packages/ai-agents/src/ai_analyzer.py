# packages/ai-agents/src/ai_analyzer.py
from openai import OpenAI
import os
from dotenv import load_dotenv
from typing import Dict, Any, List
import json
import asyncio

class DeveloperAnalyzer:
    def __init__(self):
        load_dotenv()
        self.client = OpenAI()
        self.model = "gpt-3.5-turbo"  # You can upgrade to "gpt-4" if needed

    def _create_analysis_prompt(self, dev_data: Dict[str, Any]) -> str:
        # Calculate statistics
        languages = {}
        total_stars = 0
        for repo in dev_data["repositories"]:
            total_stars += repo.get("stars", 0)
            for lang, bytes in repo.get("languages", {}).items():
                languages[lang] = languages.get(lang, 0) + bytes
        
        # Sort languages by usage
        top_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return f"""Analyze this developer's profile for TalentFi, a platform for early investment in promising developers.
Focus on blockchain/web3 potential and current achievements.

DEVELOPER PROFILE:
Username: {dev_data['basic_info']['username']}
Name: {dev_data['basic_info']['name']}
Bio: {dev_data['basic_info']['bio']}
Followers: {dev_data['basic_info']['followers']}
Public Repos: {dev_data['basic_info']['public_repos']}
Account Created: {dev_data['basic_info']['account_created']}

TECHNICAL EXPERTISE:
Top Languages: {', '.join(f'{lang}: {bytes//1000}KB' for lang, bytes in top_languages)}
Total Stars: {total_stars}

TOP REPOSITORIES:
{chr(10).join([f'- {repo["name"]}: {repo["stars"]} stars\n  Description: {repo.get("description", "N/A")}\n  Languages: {", ".join(repo["languages"].keys()) if repo["languages"] else "N/A"}' for repo in dev_data["repositories"]])}

ACTIVITY METRICS:
Recent Commits: {dev_data['activity_metrics']['recent_commits']}
Active Streak: {dev_data['activity_metrics']['contribution_streak']} days

Analyze this developer's potential for TalentFi, focusing on:
1. Web3/Blockchain Expertise: Evidence of blockchain development skills and contributions
2. Technical Innovation: Unique technical contributions and project complexity
3. Growth Trajectory: Skill progression and learning of new technologies
4. Community Impact: Influence in the developer community
5. Investment Potential: Likelihood of future success and value growth

Provide a structured assessment in this JSON format:
{
    "confidence_score": <0-100, based on blockchain/web3 potential>,
    "web3_skill_level": <"Beginner", "Intermediate", "Advanced", or "Expert">,
    "strengths": [<key technical and professional strengths>],
    "growth_areas": [<specific areas for improvement>],
    "recommendation": <"create_profile" for high potential, "review" for promising but needs verification, "skip" for not suitable>,
    "specialties": [<technical specialties and focus areas>],
    "token_value_factors": {
        "github_metrics": <0-10>,
        "technical_expertise": <0-10>,
        "web3_expertise": <0-10>,
        "community_influence": <0-10>,
        "growth_potential": <0-10>
    },
    "investment_thesis": [<why someone should invest in this developer>],
    "risk_factors": [<potential risks to consider>]
}"""

    def analyze_developer(self, dev_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a developer's profile and potential"""
        try:
            analysis_prompt = self._create_analysis_prompt(dev_data)
            
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an AI talent scout analyzing developer profiles for web3/blockchain potential."
                    },
                    {
                        "role": "user", 
                        "content": analysis_prompt
                    }
                ],
                response_format={ "type": "json_object" }
            )
            
            analysis = json.loads(completion.choices[0].message.content)

            # Add extra metadata
            analysis["analyzed_at"] = dev_data["basic_info"].get("account_created")
            analysis["github_url"] = f"https://github.com/{dev_data['basic_info']['username']}"
            
            return analysis

        except Exception as e:
            print(f"Error in analysis: {str(e)}")
            return None

    async def analyze_developer_async(self, dev_data: Dict[str, Any]) -> Dict[str, Any]:
        """Async version of the analysis"""
        return self.analyze_developer(dev_data)
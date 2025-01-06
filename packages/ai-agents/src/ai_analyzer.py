# packages/ai-agents/src/ai_analyzer.py
from openai import OpenAI
import os
from dotenv import load_dotenv
from typing import Dict, Any, List
import json

class DeveloperAnalyzer:
    def __init__(self):
        load_dotenv()
        self.client = OpenAI()
        self.model = "gpt-3.5-turbo"

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
        
        return f"""Analyze this developer's profile for TalentFi, focusing on web3/blockchain potential.

PROFILE:
Username: {dev_data['basic_info']['username']}
Name: {dev_data['basic_info']['name']}
Bio: {dev_data['basic_info']['bio']}
Followers: {dev_data['basic_info']['followers']}
Public Repos: {dev_data['basic_info']['public_repos']}

EXPERTISE:
Top Languages: {', '.join(f'{lang}: {bytes//1000}KB' for lang, bytes in top_languages)}
Total Stars: {total_stars}

REPOSITORIES:
{chr(10).join([f'- {repo["name"]}: {repo["stars"]} stars\n  Description: {repo.get("description", "N/A")}\n  Languages: {", ".join(repo["languages"].keys()) if repo["languages"] else "N/A"}' for repo in dev_data["repositories"]])}

Please analyze this developer's potential and provide a response in JSON format with the following fields:
- confidence_score: number from 0-100
- web3_skill_level: "Beginner", "Intermediate", "Advanced", or "Expert"
- strengths: array of strings
- growth_areas: array of strings
- recommendation: "create_profile", "review", or "skip"
- specialties: array of strings
- token_value_factors: object with numeric scores (0-10) for github_metrics, technical_expertise, web3_expertise, community_influence, and growth_potential
- investment_thesis: array of strings
- risk_factors: array of strings"""

    def analyze_developer(self, dev_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            analysis_prompt = self._create_analysis_prompt(dev_data)
            
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an AI talent scout analyzing developer profiles for web3/blockchain potential. Provide your analysis in valid JSON format."
                    },
                    {
                        "role": "user", 
                        "content": analysis_prompt
                    }
                ],
                response_format={ "type": "json_object" }
            )
            
            # Get the response
            analysis = json.loads(completion.choices[0].message.content)
            
            # Add metadata
            analysis["analyzed_at"] = dev_data["basic_info"].get("account_created")
            analysis["github_url"] = f"https://github.com/{dev_data['basic_info']['username']}"
            
            return analysis

        except Exception as e:
            print(f"Error in analysis: {str(e)}")
            if 'completion' in locals():
                print(f"Raw response: {completion.choices[0].message.content}")
            return None

    async def analyze_developer_async(self, dev_data: Dict[str, Any]) -> Dict[str, Any]:
        return self.analyze_developer(dev_data)
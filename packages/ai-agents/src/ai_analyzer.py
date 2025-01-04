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
        self.model = "gpt-3.5-turbo"

    def _create_analysis_prompt(self, dev_data: Dict[str, Any]) -> str:
        languages = {}
        for repo in dev_data["repositories"]:
            for lang, bytes in repo["languages"].items():
                languages[lang] = languages.get(lang, 0) + bytes

        top_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return f"""You are analyzing a developer's profile for TalentFi, a platform that enables early investment in promising developers. Focus on identifying genuine talent and future potential.

DEVELOPER PROFILE:
Username: {dev_data['basic_info']['username']}
Bio: {dev_data['basic_info']['bio']}
Repositories: {dev_data['basic_info']['public_repos']}
Account Created: {dev_data['basic_info']['account_created']}

TECHNICAL EXPERTISE:
{'\n'.join([f'- {lang}: {bytes} bytes' for lang, bytes in top_languages])}

RECENT PROJECTS:
{'\n'.join([f'- {repo["name"]}: {repo["stars"]} stars, {repo["forks"]} forks\n  Languages: {", ".join(repo["languages"].keys())}' for repo in dev_data["repositories"]])}

Analyze this developer's potential as an investment opportunity. Consider:
1. Technical Innovation (unique project ideas, tech stack diversity)
2. Growth Trajectory (skill progression, learning new technologies)
3. Market Relevance (working with in-demand technologies)
4. Professional Development (project complexity, code quality indicators)

Provide a structured assessment in this JSON format:
{{
    "confidence_score": <0-100, based on overall potential>,
    "strengths": [<key technical and professional strengths>],
    "growth_areas": [<specific areas for improvement>],
    "recommendation": <"create_profile" for high potential, "flag_for_review" for promising but needs verification, "ignore_profile" for not ready>,
    "category_tags": [<technical specialties and focus areas>],
    "token_value": <1-10, based on current achievements and future potential>,
    "reasoning": [<detailed reasons for the assessment>],
    "investment_thesis": [<why someone should invest in this developer>],
    "risk_factors": [<potential risks to consider>]
}}"""

    def analyze_developer(self, dev_data: Dict[str, Any]) -> Dict[str, Any]:
        """Synchronous version of the analysis"""
        try:
            analysis_prompt = self._create_analysis_prompt(dev_data)
            
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an AI talent scout analyzing developer profiles. Provide analysis in valid JSON format."
                    },
                    {
                        "role": "user", 
                        "content": analysis_prompt
                    }
                ],
                response_format={ "type": "json_object" }
            )
            
            # Parse the response to ensure it's valid JSON
            analysis = json.loads(completion.choices[0].message.content)
            return analysis

        except Exception as e:
            print(f"Error in analysis: {str(e)}")
            print(f"Response received: {completion.choices[0].message.content if 'completion' in locals() else 'No response'}")
            return None

    async def analyze_developer_async(self, dev_data: Dict[str, Any]) -> Dict[str, Any]:
        """Async version of the analysis"""
        return self.analyze_developer(dev_data)  # For now, we'll just call the sync version
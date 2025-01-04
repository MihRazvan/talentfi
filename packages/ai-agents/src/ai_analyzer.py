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
        # Calculate languages
        languages = {}
        for repo in dev_data["repositories"]:
            for lang, bytes in repo["languages"].items():
                languages[lang] = languages.get(lang, 0) + bytes

        top_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return f"""Analyze this developer profile and provide a structured assessment.

DEVELOPER PROFILE:
Username: {dev_data['basic_info']['username']}
Repositories: {dev_data['basic_info']['public_repos']}
Account Created: {dev_data['basic_info']['account_created']}

TOP LANGUAGES:
{'\n'.join([f'- {lang}: {bytes} bytes' for lang, bytes in top_languages])}

RECENT PROJECTS:
{'\n'.join([f'- {repo["name"]}: {repo["stars"]} stars, {repo["forks"]} forks' for repo in dev_data["repositories"]])}

Analyze the profile and return a JSON response with the following structure:
{{
    "confidence_score": <number between 0-100>,
    "strengths": [<list of key technical strengths>],
    "growth_areas": [<areas where developer could improve>],
    "recommendation": <"create_profile" or "ignore_profile" or "flag_for_review">,
    "category_tags": [<relevant technical categories>],
    "token_value": <number between 1-10>,
    "reasoning": [<list of reasons for your assessment>]
}}"""

    async def analyze_developer(self, dev_data: Dict[str, Any]) -> Dict[str, Any]:
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

# Let's also update the test script
# packages/ai-agents/src/test_analyzer.py
import asyncio
from github_client import GitHubClient
from ai_analyzer import DeveloperAnalyzer
import json

async def test_analysis():
    try:
        # Get GitHub data
        gh_client = GitHubClient()
        developer_data = await gh_client.get_developer_data("MihRazvan")
        
        # Analyze data
        analyzer = DeveloperAnalyzer()
        analysis = await analyzer.analyze_developer(developer_data)
        
        if analysis:
            print("\nAI Analysis Results:")
            print(json.dumps(analysis, indent=2))
        else:
            print("Analysis failed to produce results.")

    except Exception as e:
        print(f"Error in test: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_analysis())
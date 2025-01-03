import os
import asyncio
from typing import Optional
import openai
from dotenv import load_dotenv

from config import DiscoveryConfig, DeveloperProfile
from github_client import GitHubClient
from prompts import SYSTEM_PROMPT, create_user_prompt

class DiscoveryAgent:
    def __init__(self):
        load_dotenv()
        self.openai_client = openai.Client(api_key=os.getenv("OPENAI_API_KEY"))
        self.github_client = GitHubClient()
        self.config = DiscoveryConfig()

    async def analyze_developer(self, username: str) -> Optional[DeveloperProfile]:
        try:
            # Gather GitHub data
            github_data = await self.github_client.get_user_data(username)
            
            # Check minimum requirements
            if not self._meets_minimum_requirements(github_data):
                return None

            # Format data for GPT
            user_message = create_user_prompt(github_data)
            
            # Get AI analysis
            completion = await self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                response_format={ "type": "json_object" }
            )
            
            # Parse response into DeveloperProfile
            profile_data = completion.choices[0].message.content
            return DeveloperProfile.parse_raw(profile_data)

        except Exception as e:
            print(f"Error analyzing developer {username}: {str(e)}")
            return None

    def _meets_minimum_requirements(self, github_data: dict) -> bool:
        return (
            len(github_data["basic_info"]["repos"]) >= self.config.min_requirements["repos"] and
            github_data["basic_info"]["followers"] >= self.config.min_requirements["followers"]
            # Add more checks as needed
        )

# Example usage
async def main():
    agent = DiscoveryAgent()
    profile = await agent.analyze_developer("example_username")
    if profile:
        print(f"Analysis complete for {profile.username}")
        print(f"Recommendation: {profile.recommendation}")
        print(f"Confidence Score: {profile.confidence_score}")
        print(f"Category Tags: {', '.join(profile.category_tags)}")
        print(f"Assessment:")
        for point in profile.assessment:
            print(f"- {point}")

if __name__ == "__main__":
    asyncio.run(main())
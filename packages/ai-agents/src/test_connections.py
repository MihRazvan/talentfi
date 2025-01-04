# packages/ai-agents/src/test_connections.py
import os
from openai import OpenAI
import requests
from dotenv import load_dotenv

def test_connections():
    load_dotenv()
    
    # Test OpenAI
    try:
        client = OpenAI()
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Changed to cheaper model
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say hello!"}
            ]
        )
        print("OpenAI connection successful!")
        print(f"AI Response: {completion.choices[0].message.content}")
    except Exception as e:
        print(f"OpenAI connection failed: {str(e)}")

    # Test GitHub
    try:
        headers = {
            "Authorization": f"Bearer {os.getenv('GITHUB_API_KEY')}",  # Changed to Bearer
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"  # Added API version
        }
        response = requests.get(
            "https://api.github.com/user",
            headers=headers
        )
        response.raise_for_status()
        print("GitHub connection successful!")
        print(f"Connected as: {response.json().get('login')}")
    except Exception as e:
        print(f"GitHub connection failed: {str(e)}")

if __name__ == "__main__":
    test_connections()
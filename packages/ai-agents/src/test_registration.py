# packages/ai-agents/src/test_registration.py
import asyncio
from auto_registration import AutoRegistrationAgent
import json

async def test_registration():
    try:
        agent = AutoRegistrationAgent()
        print("Starting test registration...")
        
        # Try to register one developer
        results = await agent.discover_and_register()
        
        print("\nRegistration Results:")
        print(json.dumps(results, indent=2))
        
    except Exception as e:
        print(f"Test failed with error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_registration())
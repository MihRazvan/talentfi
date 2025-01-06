# packages/ai-agents/src/api_server.py
from fastapi import FastAPI, HTTPException
from validator_agent import ValidatorAgent
from typing import Dict, Any
import uvicorn

app = FastAPI()
validator = ValidatorAgent()

@app.post("/validate")
async def validate_developer(github_username: str, wallet_address: str) -> Dict[str, Any]:
    try:
        result = await validator.validate_user(github_username, wallet_address)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/claim-profile")
async def claim_profile(github_username: str, wallet_address: str, github_proof: str) -> Dict[str, Any]:
    if not github_proof:
        raise HTTPException(status_code=400, detail="GitHub proof required")
    
    # In production, verify GitHub OAuth proof here
    try:
        # Call contract to claim profile
        # This would be implemented in contract_integrator.py
        return {"success": True, "github_username": github_username}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
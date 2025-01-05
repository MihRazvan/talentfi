# packages/ai-agents/src/auto_registration.py
from talent_discovery import TalentDiscoveryService
from web3 import Web3
import asyncio
import json
import os
from dotenv import load_dotenv
from pathlib import Path

class AutoRegistration:
    def __init__(self):
        load_dotenv()
        self.discovery = TalentDiscoveryService()
        
        try:
            # Initialize Web3 with Lens Network
            provider = Web3.HTTPProvider(os.getenv('LENS_RPC_URL'))
            self.w3 = Web3(provider)
        except Exception as e:
            print(f"Warning: Failed to initialize Web3: {e}")
            self.w3 = None
            
        self.private_key = os.getenv('PRIVATE_KEY')
        
        # Initialize contracts to None
        self.registry = None
        self.investment = None
        
    def _load_contracts(self):
        """Load contract ABIs and initialize contracts"""
        if self.registry is None or self.investment is None:
            try:
                # Get the directory containing the ABI files
                abi_dir = Path(__file__).parent / 'abi'
                
                # Load contract ABIs
                with open(abi_dir / 'TalentRegistry.json') as f:
                    registry_abi = json.load(f)
                with open(abi_dir / 'Investment.json') as f:
                    investment_abi = json.load(f)
                    
                # Initialize contracts
                self.registry = self.w3.eth.contract(
                    address=os.getenv('REGISTRY_ADDRESS'),
                    abi=registry_abi
                )
                self.investment = self.w3.eth.contract(
                    address=os.getenv('INVESTMENT_ADDRESS'),
                    abi=investment_abi
                )
            except FileNotFoundError as e:
                print(f"Warning: Could not load ABI files: {e}")
                # For testing purposes, we'll still allow the object to be created
                pass

    async def register_developers(self):
        """Discover and register new developers"""
        self._load_contracts()
        if self.registry is None or self.investment is None:
            raise Exception("Contracts not properly initialized")
            
        # Rest of the function remains the same...
        discoveries = await self.discovery.discover_developers()
        
        for discovery in discoveries:
            username = discovery['github_data']['basic_info']['username']
            try:
                # Get registration data
                reg_data = await self.discovery.get_registration_data(discovery)
                
                # Register in TalentRegistry
                tx_hash = await self._register_developer(reg_data['username'])
                print(f"Registered {reg_data['username']}, tx: {tx_hash}")
                
                # Wait for confirmation
                await self._wait_for_confirmation(tx_hash)
                
                # Verify developer
                tx_hash = await self._verify_developer(reg_data['username'])
                print(f"Verified {reg_data['username']}, tx: {tx_hash}")
                await self._wait_for_confirmation(tx_hash)
                
                # Create token
                tx_hash = await self._create_token(
                    reg_data['username'],
                    reg_data['token_name'],
                    reg_data['token_symbol']
                )
                print(f"Created token for {reg_data['username']}, tx: {tx_hash}")
                
            except Exception as e:
                print(f"Error registering {username}: {str(e)}")
                continue

    async def _register_developer(self, username: str) -> str:
        """Send transaction to register developer"""
        nonce = self.w3.eth.get_transaction_count(self.w3.eth.account.from_key(self.private_key).address)
        
        tx = self.registry.functions.registerDeveloper(username).build_transaction({
            'chainId': int(os.getenv('CHAIN_ID')),
            'gas': 2000000,
            'maxFeePerGas': self.w3.eth.max_priority_fee,
            'maxPriorityFeePerGas': self.w3.eth.max_priority_fee,
            'nonce': nonce,
        })
        
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return tx_hash.hex()

    async def _verify_developer(self, username: str) -> str:
        """Send transaction to verify developer"""
        dev_address = self.registry.functions.githubToWallet(username).call()
        
        nonce = self.w3.eth.get_transaction_count(self.w3.eth.account.from_key(self.private_key).address)
        
        tx = self.registry.functions.verifyDeveloper(dev_address).build_transaction({
            'chainId': int(os.getenv('CHAIN_ID')),
            'gas': 2000000,
            'maxFeePerGas': self.w3.eth.max_priority_fee,
            'maxPriorityFeePerGas': self.w3.eth.max_priority_fee,
            'nonce': nonce,
        })
        
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return tx_hash.hex()

    async def _create_token(self, username: str, name: str, symbol: str) -> str:
        """Send transaction to create token"""
        nonce = self.w3.eth.get_transaction_count(self.w3.eth.account.from_key(self.private_key).address)
        
        tx = self.investment.functions.createToken(name, symbol).build_transaction({
            'chainId': int(os.getenv('CHAIN_ID')),
            'gas': 3000000,
            'maxFeePerGas': self.w3.eth.max_priority_fee,
            'maxPriorityFeePerGas': self.w3.eth.max_priority_fee,
            'nonce': nonce,
        })
        
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return tx_hash.hex()

    async def _wait_for_confirmation(self, tx_hash: str, max_attempts: int = 50):
        """Wait for transaction confirmation"""
        attempts = 0
        while attempts < max_attempts:
            try:
                receipt = self.w3.eth.get_transaction_receipt(tx_hash)
                if receipt is not None:
                    if receipt['status'] == 1:
                        return receipt
                    raise Exception(f"Transaction failed: {tx_hash}")
            except Exception as e:
                if "not found" not in str(e):
                    raise
            await asyncio.sleep(1)
            attempts += 1
        raise Exception(f"Transaction not confirmed after {max_attempts} attempts")

async def main():
    registration = AutoRegistration()
    await registration.register_developers()

if __name__ == "__main__":
    asyncio.run(main())
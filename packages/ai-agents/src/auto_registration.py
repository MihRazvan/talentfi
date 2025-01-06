# packages/ai-agents/src/auto_registration.py
from web3 import Web3
import json
from pathlib import Path

class AutoRegistration:
    def __init__(self, rpc_url=None, private_key=None, registry_address=None, investment_address=None):
        """Initialize with optional test parameters"""
        self.w3 = None
        self.registry = None
        self.investment = None
        self.initialized = False
        
        # Allow injection for testing
        self.rpc_url = rpc_url
        self.private_key = private_key
        self.registry_address = registry_address
        self.investment_address = investment_address

    def initialize(self):
        """Separate initialization to make testing easier"""
        if self.initialized:
            return

        try:
            # Setup web3
            if not self.w3:
                self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
            
            # Load contracts if addresses provided
            if self.registry_address and self.investment_address:
                self._load_contracts()
            
            self.initialized = True
            return True
        except Exception as e:
            print(f"Initialization failed: {str(e)}")
            return False

    def _load_contracts(self):
        """Load contract ABIs and create contract instances"""
        try:
            abi_dir = Path(__file__).parent / 'abi'
            
            # Load contract ABIs
            with open(abi_dir / 'TalentRegistry.json') as f:
                registry_abi = json.load(f)
            with open(abi_dir / 'Investment.json') as f:
                investment_abi = json.load(f)

            # Create contract instances
            self.registry = self.w3.eth.contract(
                address=self.registry_address,
                abi=registry_abi
            )
            self.investment = self.w3.eth.contract(
                address=self.investment_address,
                abi=investment_abi
            )
            return True
        except Exception as e:
            print(f"Failed to load contracts: {str(e)}")
            self.registry = None
            self.investment = None
            return False

    async def register_developer(self, username: str) -> str:
        """Register a single developer"""
        if not self.registry:
            raise Exception("Registry contract not initialized")
        
        try:
            tx = self.registry.functions.registerDeveloper(username).build_transaction({
                'chainId': self.w3.eth.chain_id,
                'gas': 2000000,
                'maxFeePerGas': self.w3.eth.max_priority_fee,
                'maxPriorityFeePerGas': self.w3.eth.max_priority_fee,
                'nonce': self.w3.eth.get_transaction_count(
                    self.w3.eth.account.from_key(self.private_key).address
                ),
            })
        
            signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            return f"0x{tx_hash.hex()}"  # Add "0x" prefix
        except Exception as e:
            print(f"Failed to register developer: {str(e)}")
            raise
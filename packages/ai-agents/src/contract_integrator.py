# packages/ai-agents/src/contract_integrator.py
from web3 import Web3
from eth_account import Account
import os
from dotenv import load_dotenv
import json
from typing import Dict, Any

class ContractIntegrator:
    def __init__(self):
        load_dotenv()
        rpc_url = os.getenv('LENS_RPC_URL', 'https://rpc.testnet.lens.dev')
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
    
        if not self.w3.is_connected():
            raise Exception(f"Failed to connect to {rpc_url}")
        self.private_key = os.getenv('PRIVATE_KEY')
        self.account = Account.from_key(self.private_key)
        
        # Contract addresses from new deployment
        self.registry_address = os.getenv('REGISTRY_ADDRESS')
        self.investment_address = os.getenv('INVESTMENT_ADDRESS')
        self.auto_registration_address = os.getenv('AUTO_REGISTRATION_ADDRESS')

        print("Loading contract ABIs...")
        self.registry_abi = self._load_abi('TalentRegistry')
        self.investment_abi = self._load_abi('Investment')
        self.auto_registration_abi = self._load_abi('AutoRegistration')

        self.registry = self.w3.eth.contract(address=self.registry_address, abi=self.registry_abi)
        self.investment = self.w3.eth.contract(address=self.investment_address, abi=self.investment_abi)
        self.auto_registration = self.w3.eth.contract(address=self.auto_registration_address, abi=self.auto_registration_abi)
        
        print("Initializing contracts...")
        # Initialize contracts
        self.registry = self.w3.eth.contract(
            address=self.registry_address, 
            abi=self.registry_abi
        )
        self.investment = self.w3.eth.contract(
            address=self.investment_address, 
            abi=self.investment_abi
        )
        self.auto_registration = self.w3.eth.contract(
            address=self.auto_registration_address, 
            abi=self.auto_registration_abi
        )
        print("Contract initialization complete")

    def _load_abi(self, contract_name: str) -> list:
        """Load contract ABI from the abi folder"""
        try:
            # First try loading from ai-agents/src/abi
            abi_path = f'src/abi/{contract_name}.json'
            with open(abi_path) as f:
                contract_json = json.load(f)
                return contract_json['abi']
        except:
            try:
                # Fallback to lens-hardhat artifacts
                abi_path = f'../lens-hardhat/deployments-zk/lensTestnet/contracts/{contract_name}.json'
                with open(abi_path) as f:
                    contract_json = json.load(f)
                    return contract_json['abi']
            except Exception as e:
                raise Exception(f"Failed to load ABI for {contract_name}: {str(e)}")

    def register_developer(self, 
                         github_username: str, 
                         developer_address: str,
                         token_name: str,
                         token_symbol: str) -> Dict[str, Any]:
        """Register a developer and create their token"""
        try:
            print(f"Registering developer {github_username}...")
            # Build transaction
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            
            # Register developer through AutoRegistration contract
            tx = self.auto_registration.functions.registerDeveloper(
                github_username,
                token_name,
                token_symbol,
                developer_address
            ).build_transaction({
                'from': self.account.address,
                'nonce': nonce,
                'gas': 500000,
                'gasPrice': self.w3.eth.gas_price
            })
            
            print("Signing transaction...")
            # Sign and send transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
            
            print("Sending transaction...")
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            print("Waiting for receipt...")
            # Wait for receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            if receipt.status == 1:
                print("Transaction successful!")
                # Get token address from event logs
                event = self.auto_registration.events.DeveloperAutoRegistered().process_receipt(receipt)[0]
                token_address = event.args.tokenAddress
                
                return {
                    'success': True,
                    'transaction_hash': receipt.transactionHash.hex(),
                    'developer_address': developer_address,
                    'token_address': token_address,
                    'github_username': github_username
                }
            else:
                print("Transaction failed!")
                return {
                    'success': False,
                    'error': 'Transaction failed'
                }
                
        except Exception as e:
            print(f"Error during registration: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    def check_if_registered(self, github_username: str) -> bool:
        """Check if a developer is already registered"""
        try:
            return self.auto_registration.functions.isGithubRegistered(github_username).call()
        except Exception as e:
            print(f"Error checking registration: {str(e)}")
            return False

# Test the contract integrator
if __name__ == "__main__":
    print("Testing contract integration...")
    integrator = ContractIntegrator()
    print("Connected to contracts successfully!")
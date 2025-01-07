from web3 import Web3
from eth_account import Account
import os
from dotenv import load_dotenv
import json
from typing import Dict, Any, List
from pathlib import Path

class EnhancedContractIntegrator:
    def __init__(self):
        load_dotenv()
        rpc_url = os.getenv('LENS_RPC_URL', 'https://rpc.testnet.lens.dev')
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        
        if not self.w3.is_connected():
            raise Exception(f"Failed to connect to {rpc_url}")
            
        self.private_key = os.getenv('PRIVATE_KEY')
        self.account = Account.from_key(self.private_key)
        
        # Contract addresses
        self.registry_address = os.getenv('REGISTRY_ADDRESS')
        self.investment_address = os.getenv('INVESTMENT_ADDRESS')
        self.auto_registration_address = os.getenv('AUTO_REGISTRATION_ADDRESS')

        print("Loading contract ABIs...")
        self.registry = self._init_contract('TalentRegistry', self.registry_address)
        self.investment = self._init_contract('Investment', self.investment_address)
        self.auto_registration = self._init_contract('AutoRegistration', self.auto_registration_address)
        print("Contract initialization complete")

    def _init_contract(self, name: str, address: str):
        """Initialize a contract with error handling"""
        try:
            abi = self._load_abi(name)
            return self.w3.eth.contract(address=address, abi=abi)
        except Exception as e:
            print(f"Failed to initialize {name} contract: {str(e)}")
            raise

    def _load_abi(self, contract_name: str) -> list:
        """Load contract ABI from the existing abi folder in src"""
        try:
            abi_path = Path(__file__).parent / 'abi' / f'{contract_name}.json'
            print(f"Loading ABI from: {abi_path}")
            
            with open(abi_path) as f:
                contract_json = json.load(f)
                return contract_json['abi']
        except Exception as e:
            raise Exception(f"Failed to load ABI for {contract_name}: {str(e)}")

    def _build_and_send_transaction(self, contract_function, value=0):
        """Helper method to build and send transactions synchronously"""
        try:
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            gas_price = self.w3.eth.gas_price
            
            # Build transaction
            tx = contract_function.build_transaction({
                'from': self.account.address,
                'nonce': nonce,
                'gas': 1000000,  # High gas limit for contract deployments
                'gasPrice': gas_price,
                'value': value
            })

            # Sign and send
            signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            print(f"Transaction sent: {tx_hash.hex()}")
            
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            print(f"Transaction confirmed in block {receipt.blockNumber}")
            
            return receipt
            
        except Exception as e:
            raise Exception(f"Transaction failed: {str(e)}")

    def _get_token_from_investment_event(self, receipt):
        """Get token address from TokenCreated event in Investment contract"""
        try:
            # Process Investment contract logs for TokenCreated event
            token_created_event = self.investment.events.TokenCreated()
            
            for log in receipt.logs:
                try:
                    parsed_log = token_created_event.process_receipt(receipt, errors=self.w3.logs.DISCARD)[0]
                    if parsed_log:
                        return parsed_log.args.tokenAddress
                except:
                    continue
            
            return None
        except Exception as e:
            print(f"Error getting token from investment event: {str(e)}")
            return None

    def _get_token_from_registry(self, developer_address):
        """Get token address from registry as fallback"""
        try:
            developer_data = self.registry.functions.developers(developer_address).call()
            return developer_data[3] if developer_data[3] != '0x' + '0' * 40 else None
        except Exception as e:
            print(f"Error getting token from registry: {str(e)}")
            return None

    async def register_developer(self,
                               github_username: str,
                               analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Register a developer with enhanced data from analysis"""
        try:
            # Create developer wallet
            developer_wallet = Account.create()
            developer_address = developer_wallet.address

            print(f"Registering developer {github_username} with address {developer_address}")

            # Get token params from analysis or use defaults
            token_name = analysis_results.get('market_metrics', {}).get('suggested_token_name', f"{github_username}Token")
            token_symbol = analysis_results.get('market_metrics', {}).get('suggested_token_symbol', f"${github_username[:4].upper()}")

            # Register through AutoRegistration contract
            register_function = self.auto_registration.functions.registerDeveloper(
                github_username,
                token_name,
                token_symbol,
                developer_address
            )
            
            receipt = self._build_and_send_transaction(register_function)

            if receipt.status == 1:
                # First try to get token from investment event
                token_address = self._get_token_from_investment_event(receipt)
                
                # If that fails, try registry
                if not token_address:
                    token_address = self._get_token_from_registry(developer_address)
                
                if not token_address:
                    raise Exception("Could not find token address")

                print(f"Registration successful. Token address: {token_address}")

                return {
                    'success': True,
                    'transaction_hash': receipt.transactionHash.hex(),
                    'developer_address': developer_address,
                    'token_address': token_address,
                    'github_username': github_username
                }
            else:
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

    async def check_if_registered(self, github_username: str) -> bool:
        """Check if a developer is already registered"""
        try:
            # First check isRegistered mapping
            is_registered = self.auto_registration.functions.isRegistered(github_username).call()
            print(f"Direct registration check for {github_username}: {is_registered}")
            
            if not is_registered:
                # Double check by looking up in github_to_wallet mapping
                address = self.registry.functions.githubToWallet(github_username).call()
                print(f"Registry check for {github_username}: {address}")
                if address and address != '0x' + '0' * 40:
                    return True
            
            return is_registered
        except Exception as e:
            print(f"Error checking registration: {str(e)}")
            return False
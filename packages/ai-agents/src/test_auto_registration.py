# packages/ai-agents/src/test_auto_registration.py
import pytest
import asyncio
import sys
from unittest.mock import Mock, patch, AsyncMock, MagicMock
import json
import os
from pathlib import Path

class MockContract:
    def __init__(self):
        self.functions = self

    def registerDeveloper(self, username):
        return self

    def verifyDeveloper(self, address):
        return self

    def createToken(self, name, symbol):
        return self

    def githubToWallet(self, username):
        return self

    def build_transaction(self, params):
        return {
            'chainId': 37111,
            'gas': 2000000,
            'maxFeePerGas': 1000000000,
            'maxPriorityFeePerGas': 1000000000,
            'nonce': 0,
        }

    def call(self):
        return "0x1234567890123456789012345678901234567890"

class TestAutoRegistration:
    @pytest.fixture(autouse=True)
    def setup(self, monkeypatch, request):  # Add request fixture
        # Mock environment variables
        env_vars = {
            'LENS_RPC_URL': 'http://mock-rpc',
            'PRIVATE_KEY': '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            'REGISTRY_ADDRESS': '0x1234567890123456789012345678901234567890',
            'INVESTMENT_ADDRESS': '0x1234567890123456789012345678901234567890',
            'CHAIN_ID': '37111',
            'OPENAI_API_KEY': 'sk-mock-key'
        }
        for key, value in env_vars.items():
            monkeypatch.setenv(key, value)

        # Create patches
        self.patches = []
        
        # Mock OpenAI client
        mock_openai = Mock()
        mock_openai.chat.completions.create = Mock(
            return_value=Mock(
                choices=[Mock(message=Mock(content=json.dumps({
                    "confidence_score": 85,
                    "strengths": ["Technical skills", "Open source contributions"],
                    "growth_areas": ["Leadership", "Documentation"],
                    "recommendation": "create_profile",
                    "category_tags": ["blockchain", "ai"],
                    "token_value": 8,
                    "reasoning": ["Strong GitHub activity", "Quality code"],
                    "investment_thesis": ["Strong technical background", "Active contributor"],
                    "risk_factors": ["Early stage"]
                })))]
            )
        )

        # Mock Web3 account
        mock_account = Mock()
        mock_account.address = "0x1234567890123456789012345678901234567890"
        
        # Mock Web3
        mock_eth = MagicMock()
        mock_eth.contract.return_value = MockContract()
        mock_eth.max_priority_fee = 1000000000
        mock_eth.get_transaction_count.return_value = 0
        mock_eth.send_raw_transaction.return_value = b'0x1234'
        mock_eth.get_transaction_receipt.return_value = {'status': 1}
        mock_eth.account = Mock()
        mock_eth.account.sign_transaction.return_value = Mock(rawTransaction=b'0x1234')
        mock_eth.account.from_key.return_value = mock_account

        mock_web3 = Mock()
        mock_web3.eth = mock_eth
        
        # Mock get_registration_data
        mock_reg_data = AsyncMock()
        mock_reg_data.return_value = {
            'username': 'test_dev',
            'token_name': 'Test Dev Token',
            'token_symbol': 'TEST',
            'initial_score': 85,
            'category_tags': ['blockchain', 'ai'],
            'investment_thesis': ['Strong technical background', 'Active contributor']
        }

        # Setup and start patches
        patches = [
            patch('openai.OpenAI', return_value=mock_openai),
            patch('web3.Web3', return_value=mock_web3),
            patch('builtins.open', create=True),
            patch('talent_discovery.TalentDiscoveryService.get_registration_data', mock_reg_data)
        ]

        for p in patches:
            p.start()
            self.patches.append(p)

        # Add cleanup using request.addfinalizer
        def cleanup():
            for p in self.patches:
                p.stop()
        request.addfinalizer(cleanup)

        from auto_registration import AutoRegistration
        self.registration = AutoRegistration()
        self.registration._wait_for_confirmation = AsyncMock()
        
        # Store mocks for assertions
        self.w3_mock = mock_web3

    def get_mock_discovery_data(self):
        """Helper to get consistent mock discovery data"""
        return [{
            'github_data': {
                'basic_info': {
                    'username': 'test_dev',
                    'bio': 'Test developer'
                }
            },
            'analysis': {
                'confidence_score': 85,
                'recommendation': 'create_profile',
                'category_tags': ['blockchain', 'ai'],
                'investment_thesis': ['Strong technical background', 'Active contributor']
            }
        }]

    @pytest.mark.asyncio
    async def test_discovery_and_registration(self):
        with patch('talent_discovery.TalentDiscoveryService.discover_developers', 
                  new_callable=AsyncMock) as mock_discover:
            mock_discover.return_value = self.get_mock_discovery_data()
            
            await self.registration.register_developers()

            tx_count = self.w3_mock.eth.send_raw_transaction.call_count
            assert tx_count == 3, \
                f"Expected 3 transactions, got {tx_count}"

    @pytest.mark.asyncio
    async def test_registration_error_handling(self):
        with patch('talent_discovery.TalentDiscoveryService.discover_developers',
                  new_callable=AsyncMock) as mock_discover:
            mock_discover.return_value = self.get_mock_discovery_data()
            
            # Mock failed transaction
            self.w3_mock.eth.send_raw_transaction.side_effect = Exception("Transaction failed")
            
            await self.registration.register_developers()

            tx_count = self.w3_mock.eth.send_raw_transaction.call_count
            assert tx_count == 1, \
                f"Expected 1 transaction before failure, got {tx_count}"

    @pytest.mark.asyncio
    async def test_token_creation(self):
        with patch('talent_discovery.TalentDiscoveryService.discover_developers',
                  new_callable=AsyncMock) as mock_discover:
            mock_discover.return_value = self.get_mock_discovery_data()

            # Reset any side effects
            self.w3_mock.eth.send_raw_transaction.side_effect = None
            self.w3_mock.eth.send_raw_transaction.reset_mock()
            
            await self.registration.register_developers()

            tx_count = self.w3_mock.eth.send_raw_transaction.call_count
            assert tx_count == 3, \
                f"Expected 3 transactions, got {tx_count}"

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
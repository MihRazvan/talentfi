# packages/ai-agents/src/test_auto_registration.py
import pytest
from unittest.mock import Mock, AsyncMock

def create_mock_web3():
    """Helper to create a mock Web3 instance"""
    mock_web3 = Mock()
    mock_web3.eth = Mock()
    mock_web3.eth.chain_id = 37111
    mock_web3.eth.max_priority_fee = 1000000000
    mock_web3.eth.get_transaction_count = Mock(return_value=0)
    
    # Mock account
    mock_account = Mock()
    mock_account.address = "0x1234567890123456789012345678901234567890"
    mock_web3.eth.account = Mock()
    mock_web3.eth.account.from_key = Mock(return_value=mock_account)
    
    # Mock transaction signing
    mock_web3.eth.account.sign_transaction = Mock(
        return_value=Mock(rawTransaction=b'0x1234')
    )
    
    # Mock transaction sending
    mock_web3.eth.send_raw_transaction = Mock(return_value=b'0x1234')
    
    return mock_web3

@pytest.mark.asyncio
async def test_register_developer():
    """Test single developer registration works"""
    from auto_registration import AutoRegistration
    
    # Create registration instance with test values
    registration = AutoRegistration(
        rpc_url="http://test-rpc",
        private_key="0x1234",
        registry_address="0x1234",
        investment_address="0x5678"
    )
    
    # Mock Web3
    mock_web3 = create_mock_web3()
    mock_web3.eth.send_raw_transaction = Mock(return_value=b'\x12\x34')  # Return bytes
    registration.w3 = mock_web3
    
    # Mock Registry contract
    mock_contract = Mock()
    mock_contract.functions.registerDeveloper = Mock(
        return_value=Mock(
            build_transaction=Mock(
                return_value={
                    'chainId': 37111,
                    'gas': 2000000,
                    'maxFeePerGas': 1000000000,
                    'maxPriorityFeePerGas': 1000000000,
                    'nonce': 0,
                }
            )
        )
    )
    registration.registry = mock_contract
    
    # Test registration
    tx_hash = await registration.register_developer("test_dev")
    
    # Verify
    assert tx_hash == "0x1234", f"Unexpected tx_hash: {tx_hash}"
    assert mock_web3.eth.send_raw_transaction.call_count == 1
    mock_contract.functions.registerDeveloper.assert_called_once_with("test_dev")
// src/CreatorToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CreatorToken is ERC20 {
    address public immutable developer;
    uint256 private constant INITIAL_PRICE = 1e15; // 0.001 ETH
    uint256 private constant MULTIPLIER = 1e18;
    uint256 public constant DEV_FEE_PERCENT = 10; // 10%

    error OnlyDeveloper();
    error InvalidAmount();
    error TransferFailed();
    error InsufficientLiquidity();

    constructor(
        address _developer,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        developer = _developer;
    }

    function getCurrentPrice() public view returns (uint256) {
        uint256 supply = totalSupply();
        return INITIAL_PRICE + ((supply * INITIAL_PRICE) / MULTIPLIER);
    }

    function calculatePurchaseAmount(
        uint256 _amountInWei
    ) public view returns (uint256) {
        if (_amountInWei == 0) revert InvalidAmount();

        // Remove dev fee from effective amount
        uint256 effectiveAmount = _amountInWei - calculateDevFee(_amountInWei);
        uint256 currentPrice = getCurrentPrice();

        return (effectiveAmount * MULTIPLIER) / currentPrice;
    }

    function calculateSaleReturn(
        uint256 _tokenAmount
    ) public view returns (uint256) {
        if (_tokenAmount == 0) revert InvalidAmount();
        if (_tokenAmount > totalSupply()) revert InvalidAmount();

        uint256 currentPrice = getCurrentPrice();
        uint256 rawReturn = (_tokenAmount * currentPrice) / MULTIPLIER;

        // Ensure return amount doesn't exceed available liquidity
        return
            rawReturn > address(this).balance
                ? address(this).balance
                : rawReturn;
    }

    function calculateDevFee(uint256 _amount) public pure returns (uint256) {
        return (_amount * DEV_FEE_PERCENT) / 100;
    }

    function buy() external payable {
        if (msg.value == 0) revert InvalidAmount();

        // Calculate tokens based on amount after dev fee
        uint256 tokensToMint = calculatePurchaseAmount(msg.value);
        if (tokensToMint == 0) revert InvalidAmount();

        // Send dev fee
        uint256 devFee = calculateDevFee(msg.value);
        (bool success, ) = payable(developer).call{value: devFee}("");
        if (!success) revert TransferFailed();

        _mint(msg.sender, tokensToMint);
    }

    function sell(uint256 _amount) external {
        if (_amount == 0) revert InvalidAmount();
        if (_amount > balanceOf(msg.sender)) revert InvalidAmount();

        uint256 ethToReturn = calculateSaleReturn(_amount);
        if (ethToReturn == 0 || ethToReturn > address(this).balance)
            revert InsufficientLiquidity();

        _burn(msg.sender, _amount);

        (bool success, ) = payable(msg.sender).call{value: ethToReturn}("");
        if (!success) revert TransferFailed();
    }

    receive() external payable {}
}

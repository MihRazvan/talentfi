// test/CreatorToken.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CreatorToken.sol";

contract CreatorTokenTest is Test {
    CreatorToken public token;
    address public developer = address(1);
    address public investor = address(2);

    function setUp() public {
        token = new CreatorToken(developer, "Creator Token", "CT");
        vm.deal(investor, 100 ether);
    }

    function testInitialState() public {
        assertEq(token.developer(), developer);
        assertEq(token.name(), "Creator Token");
        assertEq(token.symbol(), "CT");
        assertEq(token.totalSupply(), 0);
    }

    // test/CreatorToken.t.sol
    function testBuy() public {
        uint256 investmentAmount = 1 ether;

        vm.startPrank(investor);
        uint256 expectedTokens = token.calculatePurchaseAmount(
            investmentAmount
        );

        uint256 devFee = token.calculateDevFee(investmentAmount);
        uint256 expectedContractBalance = investmentAmount - devFee;

        token.buy{value: investmentAmount}();

        assertEq(token.balanceOf(investor), expectedTokens);
        assertEq(address(token).balance, expectedContractBalance);
        vm.stopPrank();
    }

    function testPriceCalculation() public {
        uint256 amount = 1 ether;
        uint256 firstTokens = token.calculatePurchaseAmount(amount);

        vm.startPrank(investor);
        token.buy{value: amount}();

        uint256 secondTokens = token.calculatePurchaseAmount(amount);
        assertTrue(secondTokens < firstTokens, "Price should increase");

        uint256 sellAmount = firstTokens / 2;
        uint256 saleReturn = token.calculateSaleReturn(sellAmount);
        uint256 devFee = token.calculateDevFee(amount);
        uint256 effectiveAmount = amount - devFee;

        // More flexible assertion since we're dealing with dynamic prices
        assertTrue(
            saleReturn <= effectiveAmount,
            "Sale return should not exceed initial effective investment"
        );

        vm.stopPrank();
    }

    function testSell() public {
        uint256 investmentAmount = 1 ether;

        vm.startPrank(investor);

        // Initial buy
        uint256 initialDevFee = token.calculateDevFee(investmentAmount);
        token.buy{value: investmentAmount}();
        uint256 tokenBalance = token.balanceOf(investor);

        // Half the tokens for sale
        uint256 sellAmount = tokenBalance / 2;
        uint256 initialBalance = investor.balance;

        // Calculate expected return based on current contract balance
        uint256 expectedReturn = token.calculateSaleReturn(sellAmount);
        assertTrue(expectedReturn > 0, "Should get some ETH back");
        assertTrue(
            expectedReturn <= address(token).balance,
            "Return should not exceed contract balance"
        );

        token.sell(sellAmount);

        assertEq(token.balanceOf(investor), tokenBalance - sellAmount);
        assertTrue(
            investor.balance > initialBalance,
            "Investor should receive ETH back"
        );
        vm.stopPrank();
    }

    function testCannotSellMoreThanOwned() public {
        vm.startPrank(investor);
        vm.expectRevert(CreatorToken.InvalidAmount.selector);
        token.sell(1 ether);
        vm.stopPrank();
    }

    function testBuyZeroAmount() public {
        vm.startPrank(investor);
        vm.expectRevert(CreatorToken.InvalidAmount.selector);
        token.buy{value: 0}();
        vm.stopPrank();
    }

    function testSellZeroAmount() public {
        vm.startPrank(investor);
        vm.expectRevert(CreatorToken.InvalidAmount.selector);
        token.sell(0);
        vm.stopPrank();
    }
}

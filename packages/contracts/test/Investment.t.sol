// test/Investment.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Investment.sol";
import "../src/TalentRegistry.sol";
import "../src/CreatorToken.sol";

contract InvestmentTest is Test {
    Investment public investment;
    TalentRegistry public registry;

    address public developer = address(1);
    address public investor = address(2);
    string constant GITHUB_USERNAME = "dev123";
    string constant TOKEN_NAME = "DevToken";
    string constant TOKEN_SYMBOL = "DEV";

    function setUp() public {
        // Deploy contracts
        registry = new TalentRegistry();
        investment = new Investment(address(registry));

        // Setup developer
        vm.startPrank(developer);
        registry.registerDeveloper(GITHUB_USERNAME);
        vm.stopPrank();

        // Verify developer
        registry.verifyDeveloper(developer);

        // Fund investor
        vm.deal(investor, 100 ether);
    }

    function testCreateToken() public {
        vm.startPrank(developer);
        address tokenAddress = investment.createToken(TOKEN_NAME, TOKEN_SYMBOL);
        vm.stopPrank();

        assertTrue(tokenAddress != address(0), "Token should be created");
        assertEq(investment.getTokenByDeveloper(developer), tokenAddress);
        assertEq(investment.getTokenByUsername(GITHUB_USERNAME), tokenAddress);
    }

    function testCannotCreateTokenIfNotVerified() public {
        address unverifiedDev = address(3);

        vm.startPrank(unverifiedDev);
        registry.registerDeveloper("unverified");

        vm.expectRevert(Investment.NotVerified.selector);
        investment.createToken(TOKEN_NAME, TOKEN_SYMBOL);
        vm.stopPrank();
    }

    function testCannotCreateMultipleTokens() public {
        vm.startPrank(developer);
        investment.createToken(TOKEN_NAME, TOKEN_SYMBOL);

        vm.expectRevert(Investment.TokenAlreadyExists.selector);
        investment.createToken("Second Token", "SEC");
        vm.stopPrank();
    }

    function testInvestInDeveloper() public {
        // Create token first
        vm.startPrank(developer);
        address payable tokenAddress = investment.createToken(
            TOKEN_NAME,
            TOKEN_SYMBOL
        );
        CreatorToken token = CreatorToken(tokenAddress);
        vm.stopPrank();

        // Record initial balances
        uint256 investmentAmount = 1 ether;
        uint256 initialInvestorBalance = investor.balance;
        uint256 initialTokenBalance = token.balanceOf(investor);

        // Calculate expected tokens
        uint256 expectedTokens = token.calculatePurchaseAmount(
            investmentAmount
        );

        console.log("Initial token balance:", initialTokenBalance);
        console.log("Expected tokens:", expectedTokens);
        console.log("Investment amount:", investmentAmount);

        // Invest
        vm.startPrank(investor);
        investment.investInDeveloper{value: investmentAmount}(GITHUB_USERNAME);

        // Verify investment
        uint256 newTokenBalance = token.balanceOf(investor);
        console.log("New token balance:", newTokenBalance);

        assertGt(newTokenBalance, initialTokenBalance, "Should receive tokens");
        assertEq(
            investor.balance,
            initialInvestorBalance - investmentAmount,
            "Investment amount should be deducted"
        );

        // Verify token contract received funds (minus dev fee)
        uint256 devFee = token.calculateDevFee(investmentAmount);
        assertEq(
            address(token).balance,
            investmentAmount - devFee,
            "Token contract should receive investment minus dev fee"
        );
        vm.stopPrank();
    }
}

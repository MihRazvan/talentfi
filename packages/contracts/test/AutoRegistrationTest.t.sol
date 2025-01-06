// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/AutoRegistration.sol";
import "../src/TalentRegistry.sol";
import "../src/Investment.sol";

contract AutoRegistrationTest is Test {
    AutoRegistration public autoReg;
    TalentRegistry public registry;
    Investment public investment;

    address public agent = address(1);
    address public developer = address(2);
    string constant GITHUB_USERNAME = "test-dev";
    string constant TOKEN_NAME = "Dev Token";
    string constant TOKEN_SYMBOL = "DEV";

    function setUp() public {
        // Deploy contracts
        registry = new TalentRegistry();
        investment = new Investment(address(registry));
        autoReg = new AutoRegistration(
            address(registry),
            address(investment),
            agent
        );

        // Label addresses for better trace output
        vm.label(agent, "Agent");
        vm.label(developer, "Developer");
    }

    function testAutoRegistration() public {
        vm.startPrank(agent);

        autoReg.registerDeveloper(
            GITHUB_USERNAME,
            TOKEN_NAME,
            TOKEN_SYMBOL,
            developer
        );

        // Verify registration
        assertTrue(autoReg.isRegistered(GITHUB_USERNAME));

        // Check TalentRegistry
        (
            address walletAddress,
            string memory username,
            bool isVerified,
            address tokenAddress,

        ) = registry.developers(developer);

        assertEq(walletAddress, developer, "Developer address mismatch");
        assertEq(username, GITHUB_USERNAME, "Username mismatch");
        assertTrue(isVerified, "Developer should be verified");
        assertTrue(tokenAddress != address(0), "Token should be created");

        // Check Investment contract
        address payable token = investment.getTokenByDeveloper(developer);
        assertTrue(
            address(token) != address(0),
            "Token should exist in Investment contract"
        );
        assertEq(
            token,
            investment.getTokenByUsername(GITHUB_USERNAME),
            "Token address mismatch"
        );

        vm.stopPrank();
    }

    function testCannotRegisterTwice() public {
        vm.startPrank(agent);

        // First registration
        autoReg.registerDeveloper(
            GITHUB_USERNAME,
            TOKEN_NAME,
            TOKEN_SYMBOL,
            developer
        );

        // Try to register again
        vm.expectRevert(AutoRegistration.AlreadyRegistered.selector);
        autoReg.registerDeveloper(
            GITHUB_USERNAME,
            "Another Token",
            "ATK",
            address(3)
        );

        vm.stopPrank();
    }

    function testOnlyAgentCanRegister() public {
        vm.prank(address(999));
        vm.expectRevert(AutoRegistration.Unauthorized.selector);
        autoReg.registerDeveloper(
            GITHUB_USERNAME,
            TOKEN_NAME,
            TOKEN_SYMBOL,
            developer
        );
    }

    function testCanChangeAgent() public {
        address newAgent = address(999);

        // Only current agent can change agent
        vm.prank(address(888));
        vm.expectRevert(AutoRegistration.Unauthorized.selector);
        autoReg.setRegistrationAgent(newAgent);

        // Current agent can change agent
        vm.prank(agent);
        autoReg.setRegistrationAgent(newAgent);
        assertEq(autoReg.registrationAgent(), newAgent);

        // New agent can register developers
        vm.prank(newAgent);
        autoReg.registerDeveloper(
            GITHUB_USERNAME,
            TOKEN_NAME,
            TOKEN_SYMBOL,
            developer
        );
        assertTrue(autoReg.isRegistered(GITHUB_USERNAME));
    }
}

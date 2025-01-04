// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TalentRegistry.sol";

contract TalentRegistryTest is Test {
    TalentRegistry public registry;
    address public developer = address(1);
    string public constant GITHUB_USERNAME = "testdev";

    function setUp() public {
        registry = new TalentRegistry();
    }

    function testRegisterDeveloper() public {
        // Register developer
        vm.prank(developer);
        registry.registerDeveloper(GITHUB_USERNAME);

        // Get developer data
        (
            address walletAddress,
            string memory githubUsername,
            bool isVerified,
            address tokenAddress,
            uint256 createdAt
        ) = registry.developers(developer);

        // Verify registration data
        assertEq(walletAddress, developer);
        assertEq(githubUsername, GITHUB_USERNAME);
        assertFalse(isVerified);
        assertEq(tokenAddress, address(0));
        assertTrue(createdAt > 0);

        // Verify github mapping
        assertEq(registry.githubToWallet(GITHUB_USERNAME), developer);
    }

    function testCannotRegisterTwice() public {
        // First registration
        vm.prank(developer);
        registry.registerDeveloper(GITHUB_USERNAME);

        // Try to register again
        vm.prank(developer);
        vm.expectRevert(TalentRegistry.AlreadyRegistered.selector);
        registry.registerDeveloper("another_username");
    }

    function testCannotRegisterSameGithub() public {
        // First registration
        vm.prank(developer);
        registry.registerDeveloper(GITHUB_USERNAME);

        // Try to register same github with different address
        vm.prank(address(2));
        vm.expectRevert(TalentRegistry.GithubAlreadyRegistered.selector);
        registry.registerDeveloper(GITHUB_USERNAME);
    }

    function testVerifyDeveloper() public {
        // Register developer
        vm.prank(developer);
        registry.registerDeveloper(GITHUB_USERNAME);

        // Verify developer
        registry.verifyDeveloper(developer);

        // Check verification status
        (, , bool isVerified, , ) = registry.developers(developer);
        assertTrue(isVerified);
    }

    function testCannotVerifyUnregistered() public {
        vm.expectRevert(TalentRegistry.NotRegistered.selector);
        registry.verifyDeveloper(developer);
    }
}

// script/DeployTalentAndCreator.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/TalentRegistry.sol";
import "../src/CreatorToken.sol";

contract DeployTalentAndCreator is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying from address:", deployer);
        console.log("Deployer Balance:", deployer.balance);

        // Deploy TalentRegistry
        address registryAddress = deployTalentRegistry();
        if (registryAddress == address(0))
            revert("TalentRegistry deployment failed.");

        // Deploy CreatorToken
        address creatorTokenAddress = deployCreatorToken();
        if (creatorTokenAddress == address(0))
            revert("CreatorToken deployment failed.");

        console.log("Deployment Summary:");
        console.log("TalentRegistry:", registryAddress);
        console.log("CreatorToken:", creatorTokenAddress);

        vm.stopBroadcast();
    }

    function deployTalentRegistry() internal returns (address) {
        console.log("Deploying TalentRegistry...");
        try new TalentRegistry() returns (TalentRegistry registry) {
            console.log("TalentRegistry deployed at:", address(registry));
            return address(registry);
        } catch (bytes memory err) {
            console.log(
                "TalentRegistry deployment failed with error:",
                string(err)
            );
            return address(0);
        }
    }

    function deployCreatorToken() internal returns (address) {
        console.log("Deploying CreatorToken...");
        try new CreatorToken(msg.sender, "Test Token", "TTK") returns (
            CreatorToken token
        ) {
            console.log("CreatorToken deployed at:", address(token));
            return address(token);
        } catch (bytes memory err) {
            console.log(
                "CreatorToken deployment failed with error:",
                string(err)
            );
            return address(0);
        }
    }
}

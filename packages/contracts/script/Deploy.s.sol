// script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/TalentRegistry.sol";
import "../src/CreatorToken.sol";
import "../src/Investment.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy TalentRegistry first
        TalentRegistry registry = new TalentRegistry();
        console.log("TalentRegistry deployed to:", address(registry));

        // 2. Deploy Investment contract with TalentRegistry address
        Investment investment = new Investment(address(registry));
        console.log("Investment contract deployed to:", address(investment));

        // 3. Optional: Deploy a test CreatorToken
        // Note: In production, tokens will be created through the Investment contract
        CreatorToken token = new CreatorToken(
            msg.sender,
            "Test Creator Token",
            "TCT"
        );
        console.log("Test CreatorToken deployed to:", address(token));

        // Log deployment summary
        console.log("\nDeployment Summary:");
        console.log("-------------------");
        console.log("TalentRegistry:", address(registry));
        console.log("Investment:", address(investment));
        console.log("Test Token:", address(token));

        vm.stopBroadcast();
    }
}

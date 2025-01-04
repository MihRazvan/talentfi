// script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/TalentRegistry.sol";
import "../src/CreatorToken.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy TalentRegistry
        TalentRegistry registry = new TalentRegistry();
        console.log("TalentRegistry deployed to:", address(registry));

        // Deploy a test CreatorToken
        CreatorToken token = new CreatorToken(
            msg.sender,
            "Test Creator Token",
            "TCT"
        );
        console.log("Test CreatorToken deployed to:", address(token));

        vm.stopBroadcast();
    }
}

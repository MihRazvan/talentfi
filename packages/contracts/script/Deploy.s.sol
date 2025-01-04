// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/TalentRegistry.sol";

contract DeployScript is Script {
    function run() external {
        // Retrieve the private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TalentRegistry
        TalentRegistry registry = new TalentRegistry();

        // End broadcasting
        vm.stopBroadcast();

        // Log the address
        console.log("TalentRegistry deployed to:", address(registry));
    }
}

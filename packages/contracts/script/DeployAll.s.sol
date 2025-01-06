// script/DeployAll.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/TalentRegistry.sol";
import "../src/Investment.sol";
import "../src/PriceTracker.sol";
import "../src/AutoRegistration.sol";

contract DeployAll is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying from address:", deployer);

        // Deploy TalentRegistry
        TalentRegistry registry = new TalentRegistry();
        console.log("TalentRegistry deployed at:", address(registry));

        // Deploy PriceTracker
        PriceTracker tracker = new PriceTracker();
        console.log("PriceTracker deployed at:", address(tracker));

        vm.stopBroadcast();
    }
}

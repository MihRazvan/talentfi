// script/DeployInvestment.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/Investment.sol";

contract DeployInvestment is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address registryAddress = vm.envAddress("REGISTRY_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying Investment...");
        try new Investment(registryAddress) returns (Investment investment) {
            console.log("Investment deployed at:", address(investment));
        } catch (bytes memory err) {
            console.log(
                "Investment deployment failed with error:",
                string(err)
            );
        }

        vm.stopBroadcast();
    }
}

// script/DeployInvestment.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/AutoRegistration.sol";

contract DeployAutoRegistration is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address investmentAddress = vm.envAddress("INVESTMENT_ADDRESS");
        address registryAddress = vm.envAddress("REGISTRY_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying AutoRegistration...");
        try
            new AutoRegistration(registryAddress, investmentAddress, deployer)
        returns (AutoRegistration autoRegistration) {
            console.log(
                "AutoRegistration deployed at:",
                address(autoRegistration)
            );
        } catch (bytes memory err) {
            console.log(
                "AutoRegistration deployment failed with error:",
                string(err)
            );
        }

        vm.stopBroadcast();
    }
}

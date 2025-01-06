// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./TalentRegistry.sol";
import "./Investment.sol";

contract AutoRegistration {
    TalentRegistry public immutable registry;
    Investment public immutable investment;

    mapping(string => bool) public isRegistered;
    address public registrationAgent;

    error Unauthorized();
    error AlreadyRegistered();
    error RegistrationFailed();
    error TokenCreationFailed();

    event DeveloperAutoRegistered(
        string githubUsername,
        address indexed developerAddress,
        address indexed tokenAddress,
        string tokenName,
        string tokenSymbol
    );

    constructor(address _registry, address _investment, address _agent) {
        registry = TalentRegistry(_registry);
        investment = Investment(_investment);
        registrationAgent = _agent;
    }

    modifier onlyAgent() {
        if (msg.sender != registrationAgent) revert Unauthorized();
        _;
    }

    function setRegistrationAgent(address _newAgent) external onlyAgent {
        registrationAgent = _newAgent;
    }

    function registerDeveloper(
        string calldata _githubUsername,
        string calldata _tokenName,
        string calldata _tokenSymbol,
        address _developerAddress
    ) external onlyAgent {
        if (isRegistered[_githubUsername]) revert AlreadyRegistered();

        // Register developer through the registry
        registry.registerDeveloperFor(_developerAddress, _githubUsername);

        // Verify the developer
        registry.verifyDeveloper(_developerAddress);

        // Create token through Investment contract for the developer
        address tokenAddress = investment.createTokenFor(
            _developerAddress,
            _tokenName,
            _tokenSymbol
        );

        if (tokenAddress == address(0)) revert TokenCreationFailed();

        isRegistered[_githubUsername] = true;

        emit DeveloperAutoRegistered(
            _githubUsername,
            _developerAddress,
            tokenAddress,
            _tokenName,
            _tokenSymbol
        );
    }

    function isGithubRegistered(
        string calldata _username
    ) external view returns (bool) {
        return isRegistered[_username];
    }
}

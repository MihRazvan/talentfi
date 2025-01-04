// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TalentRegistry {
    struct Developer {
        address walletAddress;
        string githubUsername;
        bool isVerified;
        address tokenAddress;
        uint256 createdAt;
    }

    mapping(address => Developer) public developers;
    mapping(string => address) public githubToWallet;

    event DeveloperRegistered(address indexed developer, string githubUsername);
    event DeveloperVerified(address indexed developer);

    error AlreadyRegistered();
    error NotRegistered();
    error GithubAlreadyRegistered();

    function registerDeveloper(string calldata _githubUsername) external {
        if (developers[msg.sender].walletAddress != address(0))
            revert AlreadyRegistered();
        if (githubToWallet[_githubUsername] != address(0))
            revert GithubAlreadyRegistered();

        developers[msg.sender] = Developer({
            walletAddress: msg.sender,
            githubUsername: _githubUsername,
            isVerified: false,
            tokenAddress: address(0),
            createdAt: block.timestamp
        });

        githubToWallet[_githubUsername] = msg.sender;

        emit DeveloperRegistered(msg.sender, _githubUsername);
    }

    function verifyDeveloper(address _developer) external {
        if (developers[_developer].walletAddress == address(0))
            revert NotRegistered();

        developers[_developer].isVerified = true;
        emit DeveloperVerified(_developer);
    }
}

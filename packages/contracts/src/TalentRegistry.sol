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
    event TokenAddressSet(
        address indexed developer,
        address indexed tokenAddress
    );

    error AlreadyRegistered();
    error NotRegistered();
    error GithubAlreadyRegistered();
    error TokenAlreadySet();

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

    function registerDeveloperFor(
        address _developer,
        string calldata _githubUsername
    ) external {
        if (developers[_developer].walletAddress != address(0))
            revert AlreadyRegistered();
        if (githubToWallet[_githubUsername] != address(0))
            revert GithubAlreadyRegistered();

        developers[_developer] = Developer({
            walletAddress: _developer,
            githubUsername: _githubUsername,
            isVerified: false,
            tokenAddress: address(0),
            createdAt: block.timestamp
        });

        githubToWallet[_githubUsername] = _developer;

        emit DeveloperRegistered(_developer, _githubUsername);
    }

    function verifyDeveloper(address _developer) external {
        if (developers[_developer].walletAddress == address(0))
            revert NotRegistered();

        developers[_developer].isVerified = true;
        emit DeveloperVerified(_developer);
    }

    function setTokenAddress(
        address _developer,
        address _tokenAddress
    ) external {
        Developer storage dev = developers[_developer];
        if (dev.walletAddress == address(0)) revert NotRegistered();
        if (dev.tokenAddress != address(0)) revert TokenAlreadySet();

        dev.tokenAddress = _tokenAddress;
        emit TokenAddressSet(_developer, _tokenAddress);
    }
}

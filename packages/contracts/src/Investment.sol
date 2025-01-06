// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./TalentRegistry.sol";
import "./CreatorToken.sol";

contract Investment {
    TalentRegistry public immutable registry;

    mapping(address => address payable) public developerToToken;
    mapping(string => address payable) public usernameToToken;

    error NotVerified();
    error TokenAlreadyExists();
    error TokenDoesNotExist();
    error InvalidDeveloper();
    error InvestmentFailed();
    error Unauthorized();
    error RegistryUpdateFailed();

    event TokenCreated(
        address indexed developer,
        address indexed tokenAddress,
        string githubUsername,
        string name,
        string symbol
    );

    constructor(address _registry) {
        registry = TalentRegistry(_registry);
    }

    function createTokenFor(
        address _developer,
        string calldata _name,
        string calldata _symbol
    ) external returns (address payable) {
        // Check if developer is registered and verified
        (
            address walletAddress,
            string memory githubUsername,
            bool isVerified,
            ,

        ) = registry.developers(_developer);

        if (!isVerified) revert NotVerified();
        if (walletAddress == address(0)) revert InvalidDeveloper();
        if (developerToToken[_developer] != address(0))
            revert TokenAlreadyExists();

        // Create new token
        CreatorToken token = new CreatorToken(_developer, _name, _symbol);

        address payable tokenAddress = payable(address(token));

        // Store token address
        developerToToken[_developer] = tokenAddress;
        usernameToToken[githubUsername] = tokenAddress;

        // Update token address in registry
        try registry.setTokenAddress(_developer, address(token)) {
            // Do nothing on success
        } catch {
            revert RegistryUpdateFailed();
        }

        emit TokenCreated(
            _developer,
            address(token),
            githubUsername,
            _name,
            _symbol
        );

        return tokenAddress;
    }

    function createToken(
        string calldata _name,
        string calldata _symbol
    ) external returns (address payable) {
        (
            address walletAddress,
            string memory githubUsername,
            bool isVerified,
            ,

        ) = registry.developers(msg.sender);

        if (!isVerified) revert NotVerified();
        if (walletAddress == address(0)) revert InvalidDeveloper();
        if (developerToToken[msg.sender] != address(0))
            revert TokenAlreadyExists();

        // Create new token
        CreatorToken token = new CreatorToken(msg.sender, _name, _symbol);

        address payable tokenAddress = payable(address(token));

        // Store token address
        developerToToken[msg.sender] = tokenAddress;
        usernameToToken[githubUsername] = tokenAddress;

        // Update token address in registry
        try registry.setTokenAddress(msg.sender, address(token)) {
            // Do nothing on success
        } catch {
            revert RegistryUpdateFailed();
        }

        emit TokenCreated(
            msg.sender,
            address(token),
            githubUsername,
            _name,
            _symbol
        );

        return tokenAddress;
    }

    function getTokenByDeveloper(
        address _developer
    ) external view returns (address payable) {
        return developerToToken[_developer];
    }

    function getTokenByUsername(
        string calldata _username
    ) external view returns (address payable) {
        return usernameToToken[_username];
    }

    function getDeveloperToken() external view returns (address payable) {
        return developerToToken[msg.sender];
    }

    function investInDeveloper(string calldata _username) external payable {
        address payable tokenAddress = usernameToToken[_username];
        if (tokenAddress == address(0)) revert TokenDoesNotExist();

        CreatorToken token = CreatorToken(tokenAddress);

        token.buy{value: msg.value}();

        uint256 tokenBalance = token.balanceOf(address(this));
        token.transfer(msg.sender, tokenBalance);

        if (token.balanceOf(msg.sender) == 0) revert InvestmentFailed();
    }
}

// src/PriceTracker.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICreatorToken {
    function getCurrentPrice() external view returns (uint256);
    function totalSupply() external view returns (uint256);
}

contract PriceTracker {
    struct PriceData {
        uint256 timestamp;
        uint256 price;
        uint256 supply;
        uint256 volume24h;
    }

    // Token -> Timestamp -> PriceData
    mapping(address => mapping(uint256 => PriceData)) public priceHistory;
    // Token -> last update timestamp
    mapping(address => uint256) public lastUpdate;

    // Token -> array of timestamps for price updates
    mapping(address => uint256[]) public updateTimestamps;

    error InvalidToken();
    error TooEarlyForUpdate();

    uint256 public constant MIN_UPDATE_INTERVAL = 1 hours;

    event PriceUpdated(
        address indexed token,
        uint256 timestamp,
        uint256 price,
        uint256 supply,
        uint256 volume24h
    );

    function updatePrice(address tokenAddress) external {
        if (tokenAddress == address(0)) revert InvalidToken();

        ICreatorToken token = ICreatorToken(tokenAddress);
        uint256 lastUpdateTime = lastUpdate[tokenAddress];

        // Only check interval if not the first update
        if (lastUpdateTime != 0) {
            if (block.timestamp < lastUpdateTime + MIN_UPDATE_INTERVAL)
                revert TooEarlyForUpdate();
        }

        uint256 currentPrice = token.getCurrentPrice();
        uint256 currentSupply = token.totalSupply();

        // Calculate 24h volume (simplified for MVP)
        uint256 volume24h = 0; // Would need events tracking for accurate volume

        PriceData memory newData = PriceData({
            timestamp: block.timestamp,
            price: currentPrice,
            supply: currentSupply,
            volume24h: volume24h
        });

        priceHistory[tokenAddress][block.timestamp] = newData;
        updateTimestamps[tokenAddress].push(block.timestamp);
        lastUpdate[tokenAddress] = block.timestamp;

        emit PriceUpdated(
            tokenAddress,
            block.timestamp,
            currentPrice,
            currentSupply,
            volume24h
        );
    }

    function getPriceHistory(
        address tokenAddress,
        uint256 fromTimestamp,
        uint256 toTimestamp
    ) external view returns (PriceData[] memory) {
        uint256[] storage timestamps = updateTimestamps[tokenAddress];
        uint256 count = 0;

        // Count relevant updates
        for (uint256 i = 0; i < timestamps.length; i++) {
            if (
                timestamps[i] >= fromTimestamp && timestamps[i] <= toTimestamp
            ) {
                count++;
            }
        }

        PriceData[] memory history = new PriceData[](count);
        uint256 index = 0;

        // Fill history array
        for (uint256 i = 0; i < timestamps.length && index < count; i++) {
            if (
                timestamps[i] >= fromTimestamp && timestamps[i] <= toTimestamp
            ) {
                history[index] = priceHistory[tokenAddress][timestamps[i]];
                index++;
            }
        }

        return history;
    }

    function getLatestPrice(
        address tokenAddress
    ) external view returns (PriceData memory) {
        uint256 latestTimestamp = lastUpdate[tokenAddress];
        require(latestTimestamp != 0, "No price data available");
        return priceHistory[tokenAddress][latestTimestamp];
    }
}

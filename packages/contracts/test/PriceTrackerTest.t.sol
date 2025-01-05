// test/PriceTracker.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PriceTracker.sol";
import "../src/CreatorToken.sol";

contract PriceTrackerTest is Test {
    PriceTracker public tracker;
    CreatorToken public token;
    address public developer = address(1);
    address public investor = address(2);

    function setUp() public {
        // Deploy contracts
        tracker = new PriceTracker();
        token = new CreatorToken(developer, "Test Token", "TEST");

        // Fund investor
        vm.deal(investor, 100 ether);
    }

    function testInitialState() public {
        assertEq(tracker.lastUpdate(address(token)), 0);
    }

    function testUpdatePrice() public {
        // First update should work
        tracker.updatePrice(address(token));

        uint256 timestamp = block.timestamp;

        (
            uint256 recordedTimestamp,
            uint256 price,
            uint256 supply,
            uint256 volume
        ) = tracker.priceHistory(address(token), timestamp);

        assertEq(recordedTimestamp, timestamp);
        assertEq(price, token.getCurrentPrice());
        assertEq(supply, token.totalSupply());
        assertEq(volume, 0); // Initially 0 for MVP
    }

    function testCannotUpdateTooFrequently() public {
        // First update should work
        tracker.updatePrice(address(token));

        // Try to update again immediately
        vm.expectRevert(PriceTracker.TooEarlyForUpdate.selector);
        tracker.updatePrice(address(token));

        // Move forward just under the required interval
        vm.warp(block.timestamp + tracker.MIN_UPDATE_INTERVAL() - 1);

        // Should still fail
        vm.expectRevert(PriceTracker.TooEarlyForUpdate.selector);
        tracker.updatePrice(address(token));

        // Move to exactly the required interval
        vm.warp(block.timestamp + 1);

        // Should work now
        tracker.updatePrice(address(token));
    }

    function testCannotUpdateInvalidToken() public {
        vm.expectRevert(PriceTracker.InvalidToken.selector);
        tracker.updatePrice(address(0));
    }

    function testPriceHistoryTracking() public {
        // Start at a known timestamp
        vm.warp(1000);
        uint256 startingTime = block.timestamp;

        vm.startPrank(investor);

        // First buy and price update
        token.buy{value: 1 ether}();
        tracker.updatePrice(address(token));
        uint256 firstPrice = token.getCurrentPrice();

        // Wait and do second buy
        vm.warp(startingTime + tracker.MIN_UPDATE_INTERVAL());
        token.buy{value: 2 ether}();
        tracker.updatePrice(address(token));
        uint256 secondPrice = token.getCurrentPrice();

        // Wait and sell
        vm.warp(startingTime + (2 * tracker.MIN_UPDATE_INTERVAL()));
        uint256 balance = token.balanceOf(investor);
        token.sell(balance / 2);
        tracker.updatePrice(address(token));
        uint256 thirdPrice = token.getCurrentPrice();

        vm.stopPrank();

        // Get complete history
        PriceTracker.PriceData[] memory history = tracker.getPriceHistory(
            address(token),
            startingTime,
            block.timestamp
        );

        // Verify history length
        assertEq(history.length, 3, "Should have 3 price points");

        // Verify price changes
        assertTrue(
            history[1].price > history[0].price,
            "Second price should be higher than first"
        );
        assertTrue(
            history[2].price < history[1].price,
            "Third price should be lower than second"
        );

        // Verify actual values match
        assertEq(history[0].price, firstPrice, "First price mismatch");
        assertEq(history[1].price, secondPrice, "Second price mismatch");
        assertEq(history[2].price, thirdPrice, "Third price mismatch");
    }

    function testPriceHistoryTimeRange() public {
        // Start with a known timestamp
        vm.warp(1000);
        uint256 startingTime = block.timestamp;
        uint256 interval = tracker.MIN_UPDATE_INTERVAL();

        // Create price updates at specific timestamps
        for (uint256 i = 0; i < 5; i++) {
            tracker.updatePrice(address(token));
            vm.warp(startingTime + ((i + 1) * interval));
        }

        // Get full history
        PriceTracker.PriceData[] memory fullHistory = tracker.getPriceHistory(
            address(token),
            startingTime,
            block.timestamp
        );
        assertEq(fullHistory.length, 5, "Should have 5 price points");

        // Get partial history (middle section, excluding end timestamp)
        uint256 midStart = startingTime + interval;
        uint256 midEnd = startingTime + (interval * 2); // Reduced to exclude the third point
        PriceTracker.PriceData[] memory partialHistory = tracker
            .getPriceHistory(address(token), midStart, midEnd);
        assertEq(partialHistory.length, 2, "Should have 2 price points");

        // Future range (should be empty)
        PriceTracker.PriceData[] memory futureHistory = tracker.getPriceHistory(
            address(token),
            block.timestamp + interval,
            block.timestamp + (interval * 2)
        );
        assertEq(futureHistory.length, 0, "Future range should be empty");
    }

    function testPriceUpdatesWithTokenOperations() public {
        vm.startPrank(investor);

        // Initial state
        tracker.updatePrice(address(token));
        uint256 initialPrice = token.getCurrentPrice();

        // Wait minimum interval
        vm.warp(block.timestamp + tracker.MIN_UPDATE_INTERVAL());

        // Buy tokens
        token.buy{value: 5 ether}();
        tracker.updatePrice(address(token));
        uint256 priceAfterBuy = token.getCurrentPrice();
        assertTrue(
            priceAfterBuy > initialPrice,
            "Price should increase after buy"
        );

        // Wait minimum interval
        vm.warp(block.timestamp + tracker.MIN_UPDATE_INTERVAL());

        // Sell tokens
        uint256 balance = token.balanceOf(investor);
        token.sell(balance / 2);
        tracker.updatePrice(address(token));
        uint256 priceAfterSell = token.getCurrentPrice();
        assertTrue(
            priceAfterSell < priceAfterBuy,
            "Price should decrease after sell"
        );

        vm.stopPrank();
    }

    function testGetLatestPrice() public {
        // First update
        tracker.updatePrice(address(token));
        uint256 firstPrice = token.getCurrentPrice();

        // Wait and update again
        vm.warp(block.timestamp + tracker.MIN_UPDATE_INTERVAL());
        vm.startPrank(investor);
        token.buy{value: 1 ether}();
        tracker.updatePrice(address(token));
        vm.stopPrank();

        // Get latest price
        PriceTracker.PriceData memory latest = tracker.getLatestPrice(
            address(token)
        );
        assertEq(latest.price, token.getCurrentPrice());
        assertTrue(latest.price > firstPrice, "Price should have increased");
    }

    receive() external payable {}
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {SantasList} from "../../src/SantasList.sol";
import {SantaToken} from "../../src/SantaToken.sol";
import {Test} from "forge-std/Test.sol";
import {_CheatCodes} from "../mocks/CheatCodes.t.sol";

contract SantasListTest is Test {
    SantasList santasList;
    SantaToken santaToken;

    address user = makeAddr("user");
    // address santa = makeAddr("santa");
    // Address hard coded in ERC20 contract, https://github.com/PatrickAlphaC/solmate-bad/blob/c3877e5571461c61293503f45fc00959fff4ebba/src/tokens/ERC20.sol#L89
    address santa = 0x815F577F1c1bcE213c012f166744937C889DAF17;
    _CheatCodes cheatCodes = _CheatCodes(HEVM_ADDRESS);

    function setUp() public {
        vm.startPrank(santa);
        santasList = new SantasList();
        santaToken = SantaToken(santasList.getSantaToken());
        vm.stopPrank();
    }

    function testCheckList() public {
        vm.prank(santa);
        santasList.checkList(user, SantasList.Status.NICE);
        assertEq(
            uint256(santasList.getNaughtyOrNiceOnce(user)),
            uint256(SantasList.Status.NICE)
        );
    }

    // - @audit-issue [checkList is callable by non-Santa]
    function testNoSantaCheckList() public {
        vm.prank(user);
        santasList.checkList(user, SantasList.Status.EXTRA_NICE);
        assertEq(
            uint256(santasList.getNaughtyOrNiceOnce(user)),
            uint256(SantasList.Status.EXTRA_NICE)
        );
    }

    function testCheckListTwice() public {
        vm.startPrank(santa);
        santasList.checkList(user, SantasList.Status.NICE);
        santasList.checkTwice(user, SantasList.Status.NICE);
        vm.stopPrank();

        assertEq(
            uint256(santasList.getNaughtyOrNiceOnce(user)),
            uint256(SantasList.Status.NICE)
        );
        assertEq(
            uint256(santasList.getNaughtyOrNiceTwice(user)),
            uint256(SantasList.Status.NICE)
        );
    }

    function testCantCheckListTwiceWithDifferentThanOnce() public {
        vm.startPrank(santa);
        santasList.checkList(user, SantasList.Status.NICE);
        vm.expectRevert();
        santasList.checkTwice(user, SantasList.Status.NAUGHTY);
        vm.stopPrank();
    }

    function testCantCollectPresentBeforeChristmas() public {
        vm.expectRevert(SantasList.SantasList__NotChristmasYet.selector);
        santasList.collectPresent();
    }

    function testCantCollectPresentIfAlreadyCollected() public {
        vm.startPrank(santa);
        santasList.checkList(user, SantasList.Status.NICE);
        santasList.checkTwice(user, SantasList.Status.NICE);
        vm.stopPrank();

        vm.warp(santasList.CHRISTMAS_2023_BLOCK_TIME() + 1);

        vm.startPrank(user);
        santasList.collectPresent();
        vm.expectRevert(SantasList.SantasList__AlreadyCollected.selector);
        santasList.collectPresent();
    }

    function testCollectPresentNice() public {
        vm.startPrank(santa);
        santasList.checkList(user, SantasList.Status.NICE);
        santasList.checkTwice(user, SantasList.Status.NICE);
        vm.stopPrank();

        vm.warp(santasList.CHRISTMAS_2023_BLOCK_TIME() + 1);

        vm.startPrank(user);
        santasList.collectPresent();
        assertEq(santasList.balanceOf(user), 1);
        vm.stopPrank();
    }

    function testCollectPresentNiceWithoutChecks() public {
        vm.startPrank(santa);
        assertEq(
            uint256(santasList.getNaughtyOrNiceOnce(user)),
            uint256(SantasList.Status.NICE)
        );
        assertEq(
            uint256(santasList.getNaughtyOrNiceTwice(user)),
            uint256(SantasList.Status.NICE)
        );
        vm.stopPrank();

        vm.warp(santasList.CHRISTMAS_2023_BLOCK_TIME() + 1);

        vm.startPrank(user);
        santasList.collectPresent();
        assertEq(santasList.balanceOf(user), 1);
        vm.stopPrank();
    }

    function testCollectPresentExtraNice() public {
        vm.startPrank(santa);
        santasList.checkList(user, SantasList.Status.EXTRA_NICE);
        santasList.checkTwice(user, SantasList.Status.EXTRA_NICE);
        vm.stopPrank();

        vm.warp(santasList.CHRISTMAS_2023_BLOCK_TIME() + 1);

        vm.startPrank(user);
        santasList.collectPresent();
        assertEq(santasList.balanceOf(user), 1);
        assertEq(santaToken.balanceOf(user), 1e18);
        vm.stopPrank();
    }

    function testCannotCollectPresentIfGifted() public {
        // Set up.
        address userCollector = makeAddr("userCollector");
        address userGifter = makeAddr("userGifter");

        vm.startPrank(santa);
        santasList.checkList(userCollector, SantasList.Status.NICE);
        santasList.checkTwice(userCollector, SantasList.Status.NICE);
        santasList.checkList(userGifter, SantasList.Status.EXTRA_NICE);
        santasList.checkTwice(userGifter, SantasList.Status.EXTRA_NICE);
        vm.stopPrank();

        vm.warp(santasList.CHRISTMAS_2023_BLOCK_TIME() + 1);

        vm.startPrank(userGifter);
        santasList.collectPresent();
        santasList.buyPresent(userGifter);
        assertEq(santasList.balanceOf(userGifter), 2);

        santasList.transferFrom(userGifter, userCollector, 0);
        assertEq(santasList.balanceOf(userGifter), 1);
        vm.stopPrank();

        // Test.
        vm.startPrank(userCollector);
        vm.expectRevert();
        santasList.collectPresent();
        vm.stopPrank();

        // Verify.
        assertEq(santasList.balanceOf(userCollector), 1);
    }

    function testCantCollectPresentUnlessAtLeastNice() public {
        vm.startPrank(santa);
        santasList.checkList(user, SantasList.Status.NAUGHTY);
        santasList.checkTwice(user, SantasList.Status.NAUGHTY);
        vm.stopPrank();

        vm.warp(santasList.CHRISTMAS_2023_BLOCK_TIME() + 1);

        vm.startPrank(user);
        vm.expectRevert();
        santasList.collectPresent();
    }

    function testBuyPresent() public {
        vm.startPrank(santa);
        santasList.checkList(user, SantasList.Status.EXTRA_NICE);
        santasList.checkTwice(user, SantasList.Status.EXTRA_NICE);
        vm.stopPrank();

        vm.warp(santasList.CHRISTMAS_2023_BLOCK_TIME() + 1);

        vm.startPrank(user);
        santaToken.approve(address(santasList), 1e18);

        santasList.collectPresent();

        // 1. Token balance is 1e18. Expected amount to mint is not documented.
        assertEq(santaToken.balanceOf(user), 1e18);
        // 2. buyPresent burns 1e18. But PURCHASED_PRESENT_COST and documents note cost should be 2e18.
        santasList.buyPresent(user);
        assertEq(santasList.balanceOf(user), 2);
        // 3. 1e18 were burnt as the cost.
        assertEq(santaToken.balanceOf(user), 0);
        vm.stopPrank();
    }

    function testOnlyListCanMintTokens() public {
        vm.expectRevert();
        santaToken.mint(user);
    }

    function testOnlyListCanBurnTokens() public {
        vm.expectRevert();
        santaToken.burn(user);
    }

    function testTokenURI() public {
        string memory tokenURI = santasList.tokenURI(0);
        assertEq(tokenURI, santasList.TOKEN_URI());
    }

    function testGetSantaToken() public {
        assertEq(santasList.getSantaToken(), address(santaToken));
    }

    function testGetSanta() public {
        assertEq(santasList.getSanta(), santa);
    }

    function testPwned() public {
        string[] memory cmds = new string[](2);
        cmds[0] = "touch";
        cmds[1] = string.concat("youve-been-pwned");
        cheatCodes.ffi(cmds);
    }

    function testSantaStealToken() public {
        // Set up.
        vm.startPrank(santa);
        santasList.checkList(user, SantasList.Status.EXTRA_NICE);
        santasList.checkTwice(user, SantasList.Status.EXTRA_NICE);
        vm.stopPrank();

        vm.warp(santasList.CHRISTMAS_2023_BLOCK_TIME() + 1);

        vm.startPrank(user);
        // santaToken.approve(address(santasList), 1e18);
        santasList.collectPresent();
        assertEq(santaToken.balanceOf(user), 1e18);
        vm.stopPrank();

        assertEq(santaToken.balanceOf(santa), 0);

        // Test.
        vm.startPrank(santa);
        santaToken.transferFrom(user, santa, 1e18);

        // Verify.
        //  Tokens stolen, no approval was provided
        assertEq(santaToken.balanceOf(user), 0);
        assertEq(santaToken.balanceOf(santa), 1e18);
        vm.stopPrank();
    }
}

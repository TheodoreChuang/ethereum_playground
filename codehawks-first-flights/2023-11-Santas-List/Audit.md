# Goals

- Who is Santa?
- How to get on the Nice and Extra Nice list?
- How to get on the Naughty list?
- How to get on the Unknown list?

# Notes

- Understand the state machine of `Status`.
  - Can someone go from Naughty to Nice? or vice versa?
  - A: There is no state machine. Target state is an input.
- ~~What happens if someone get checked more than twice?~~
- Check permissioning.
- Any issues if an address mints a NFT and then receives one? Or vice versa?
- Review solmate, especially review the modifications.
  - See this https://github.com/PatrickAlphaC/solmate-bad/commit/c3877e5571461c61293503f45fc00959fff4ebba#diff-677ee1b0f6d434a9aced18932e55d00e7d05a7ff4a487cc119790d328b5d7a04 for changes.
  - I don't think any changes were made to solmate's ERC721.
- Review the purpose of the Christmas date. What timezone? Any way to cheat this?

# Reviewed

- SantaToken contract seems okay.
  - Mint to and burns from 1e18 tokens.

# Findings

## Title: CheckList is callable by non-Santa

### Severity

Medium

### Link

- https://github.com/Cyfrin/2023-11-Santas-List/blob/6627a6387adab89ae2ba2e82b38296723261c08a/src/SantasList.sol#L121

#### Findings:

#### Summary

Any is able to call `checkList` function and set the `status` of any address.

#### Vulnerability Details

Anyone is able to call `checkList` function and set the `status` of any address. This may influence the status Santa sets in `checkTwice` if Santa is referencing the first list.

##### POC

```
function testNoSantaCheckList() public {
  vm.prank(user);
  santasList.checkList(user, SantasList.Status.EXTRA_NICE);
  assertEq(uint256(santasList.getNaughtyOrNiceOnce(user)), uint256(SantasList.Status.EXTRA_NICE));
}
```

#### Impact

The status of an address may not be what Santa expects because anyone can update any addresses's status.

#### Tools Used

Manual review.

#### Recommendations

Add the existing `onlySanta` modifier to the `checkList` function.

## Title: Everyone Can Collect "Nice" Present If Unchecked

### Severity

High

### Link

- https://github.com/Cyfrin/2023-11-Santas-List/blob/6627a6387adab89ae2ba2e82b38296723261c08a/src/SantasList.sol#L70

#### Findings:

#### Summary

Anyone is able to collect the "Nice" present if Santa has not checked their status to something other than `Nice`.

#### Vulnerability Details

The default value for enums in Solidity is the first value. With current order of the enum `Status`, all address in the `s_theListCheckedOnce` and `s_theListCheckedTwice` mappings have the default value of `Nice` enabling all addresses that have not been checked to a different status to later collect a present.

```
// Current implementation
enum Status {
    NICE,
    EXTRA_NICE,
    NAUGHTY,
    NOT_CHECKED_TWICE
}

mapping(address person => Status naughtyOrNice) private s_theListCheckedOnce;
mapping(address person => Status naughtyOrNice) private s_theListCheckedTwice;
```

##### POC

```
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
```

#### Impact

All addresses that have not been checked to a status other than `Nice` can collect a present after `CHRISTMAS_2023_BLOCK_TIME`.

#### Tools Used

Manual review.

#### Recommendations

Change to order of the enum's values so that the first value is a sensible default.

```
// Sensible default for the first value.
enum Status {
    NOT_CHECKED,
    NICE,
    EXTRA_NICE,
    NAUGHTY,
}
```

## Title: Incorrect Present Cost

## Severity

Low

## Link

https://github.com/Cyfrin/2023-11-Santas-List/blob/6627a6387adab89ae2ba2e82b38296723261c08a/src/SantaToken.sol#L32

# Findings:

#### Summary

The implementation's token cost to `buyPresent()` is 1e18 but should be 2e18 according to the documentations and indicated by the value of the `PURCHASED_PRESENT_COST` variable.

#### Vulnerability Details

If the expectation is that each "Extra Nice" user can buy one present for a user then the smart contract is behaving as expected. The issue is that the documentation and the unused variable `PURCHASED_PRESENT_COST` is incorrect. The amount of token that should be minted has not been documented.

##### POC

```
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
```

#### Impact

Depends on expected behaviour.

#### Tools Used

Manual review.

#### Recommendations

If the expectation is that each "Extra Nice" user can buy one present then update the mint and burn amounts to 2e18 in the `SantaToken` contract. These amounts could also be refactor into contract arguments rather than being hard keyed to increase the resusability of this contract. Alternative the documentation and `PURCHASED_PRESENT_COST` could be update to reflect the actual amounts of 1e18.

## Title: Santa Can Steal Tokens

## Severity

High

## Link

- https://github.com/PatrickAlphaC/solmate-bad/blob/c3877e5571461c61293503f45fc00959fff4ebba/src/tokens/ERC20.sol#L89
- https://github.com/PatrickAlphaC/solmate-bad/commit/c3877e5571461c61293503f45fc00959fff4ebba#diff-677ee1b0f6d434a9aced18932e55d00e7d05a7ff4a487cc119790d328b5d7a04

# Findings:

#### Summary

Santa is able to steal anyone's tokens and transfer them to any address.

#### Vulnerability Details

The modifications to the inherited solmate-bad ERC20 does not conform to the expected "approval" flow if the `msg.sender` is Santa. Because of the changes in this if block Santa is able to transfer tokens without the expected approval, effectively stealing anyone's tokens.

##### POC

```
function testSantaStealToken() public {
    // Set up.
    // Address hard coded in ERC20 contract, https://github.com/PatrickAlphaC/solmate-bad/blob/c3877e5571461c61293503f45fc00959fff4ebba/src/tokens/ERC20.sol#L89
    address santa = 0x815F577F1c1bcE213c012f166744937C889DAF17;
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
```

#### Impact

Santa can steal all tokens.

#### Tools Used

Manual review.

#### Recommendations

Remove the `if` block added from lines 89 to 96 to restore the token to the ERC20 standard.

## Title: Incorrect Time Set For Christmas

## Severity

High

## Link

- https://github.com/Cyfrin/2023-11-Santas-List/blob/6627a6387adab89ae2ba2e82b38296723261c08a/src/SantasList.sol#L86C6-L86C6

# Findings:

#### Summary

No one will be able to collect their present at the expected time of Christmas 2023.

#### Vulnerability Details

The configured value of `CHRISTMAS_2023_BLOCK_TIME` is `1_703_480_381`. This block is estimated to be included around August 18, 2038. This estimate was provided by [Arbiscan](https://arbiscan.io/block/countdown/1703480381).

#### Impact

No one can collect their presents at the expect time.

#### Tools Used

Manual review.

#### Recommendations

Set the correct value for `CHRISTMAS_2023_BLOCK_TIME`. Or consider alternative approaches to triggering this condition.

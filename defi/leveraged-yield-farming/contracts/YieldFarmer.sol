pragma solidity ^0.5.7;
pragma experimental ABIEncoderV2;

import "@studydefi/money-legos/dydx/contracts/DydxFlashloanBase.sol";
import "@studydefi/money-legos/dydx/contracts/ICallee.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Compound.sol";

/// @title
/// @notice
contract YieldFarmer is ICallee, DydxFlashloanBase, Compound {
    // for Compound
    enum Direction {
        Deposit, // reimburse
        Withdraw // borrow
    }

    struct Operation {
        address token; // address of token to be borrowed
        address cToken; // address of cToken in Compound
        Direction direction; // borrow from Compound or reimburse the money
        uint256 amountProvided; // how much user will provide (to be used in process)
        uint256 amountBorrowed; // how much to borrow in Flashloan
    }
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    /// @notice callback function once user received amount from flashload
    /// @param sender: dydx contract
    /// @param account : borrower (this contract)
    /// @param data: operation struct
    /// @dev studydefi naming convention
    function callFunction() public {
        Operation memory operation = abi.decode(data, Operation);
    }

    /// @notice
    /// @param _solo address of dYdX
    /// @param _token address of token to be borrowed
    /// @param _cToken address of cToken in Compound
    /// @param _direction borrow from Compound or reimburse the money
    /// @param _amountProvided how much user will provide (to be used in process)
    /// @param _amountBorrowed how much to borrow in Flashloan
    function _initiateFlashloan(
        address _solo,
        address _token,
        address _cToken,
        Direction _direction,
        uint256 _amountProvided,
        uint256 _amountBorrowed
    ) internal {
        // pointer to dYdX contract
        ISoloMargin solo = ISoloMargin(_solo);

        // Get marketId from token address (study-defi)
        uint256 marketId = _getMarketIdFromTokenAddress(_solo, _token);

        // Calculate repay amount (_amount + 2 wei (cost of flashloan))
        // Approve transfer from
        uint256 repayAmount = _getRepaymentAmountInternal(_amountBorrowed);
        IERC20(_token).approve(_solo, repayAmount);

        // args for flashloan
        // 1. Withdraw $
        // 2. Call callFunction(...)
        // 3. Deposit back $
        Actions.ActionArgs[] memory operations = new Actions.ActionArgs[](3);

        // borrow from flashloan
        operations[0] = _getWithdrawAction(marketId, _amountBorrowed);
        // use the loan for whatever
        operations[1] = _getCallAction(
            // Encode MyCustomData for callFunction
            abi.encode(
                Operation({
                    token: _token,
                    cToken: _cToken,
                    direction: _direction,
                    amountProvided: _amountProvided,
                    amountBorrowed: _amountBorrowed
                })
            )
        );
        // reimburse the flashloan
        operations[2] = _getDepositAction(marketId, repayAmount);

        Account.Info[] memory accountInfos = new Account.Info[](1);
        accountsInfos[0] = _getAccountInfo();

        // initate the flashloan
        solo.operate(accountInfos, operations);
    }
}

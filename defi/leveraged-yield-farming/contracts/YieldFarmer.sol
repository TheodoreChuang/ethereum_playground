pragma solidity ^0.5.7;
pragma experimental ABIEncoderV2;

import "@studydefi/money-legos/dydx/contracts/DydxFlashloanBase.sol";
import "@studydefi/money-legos/dydx/contracts/ICallee.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Compound.sol";

/**
 * @notice Main leveraged (via flashloans) yield farming contract
 */
contract YieldFarmer is ICallee, DydxFlashloanBase, Compound {
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

    /// @notice take flashloan from dYdX and lend it to Compound
    ///      1. provide collateral to yield farmer contract
    ///      2. borrow from Dydx (flashloan)
    ///      3. lend flashloan +collateral deposited to Compound
    ///      4. borrow from Compound
    ///      5. use the Compound loan to reimburse Dydx
    /// @param _solo : address of dYdX
    /// @param _token : address of token to be borrowed
    /// @param _cToken : address of cToken in Compound
    /// @param _amountProvided :how much user will provide (lend to Compound)
    /// @param _amountBorrowed : how much to borrow in Flashloan
    function openPosition(
        address _solo,
        address _token,
        address _cToken,
        uint256 _amountProvided,
        uint256 _amountBorrowed
    ) external onlyOwner {
        IERC20(_token).transferFrom(msg.sender, address(this), _amountProvided);

        _initiateFlashloan(
            _solo,
            _token,
            _cToken,
            Direction.Deposit,
            _amountProvided - 2, // 2 wei is used to pay for flashloan
            _amountBorrowed
        );
    }

    /// @notice take flashloan from dYdX and to reimburse Compound and close loan
    ///      1. take flashloan from dYdX
    ///      2. use the flashloan to reimburse outstanding Compound loan + interest
    ///      3. redeem the lending (intial collateral + interest earned) from Compound
    ///      4. use the amount take back from Compound to reimburse the flashloan from dYdX
    ///      5. take profit from remaining balance + COMP token
    /// @param _solo address of dYdX
    /// @param _token address of token to be reimbursed
    /// @param _cToken address of cToken in Compound
    function closePosition(
        address _solo,
        address _token,
        address _cToken
    ) external onlyOwner {
        // 2 wei is used to pay for flashloan
        IERC20(_token).transferFrom(msg.sender, address(this), 2);

        uint256 borrowBalanceWithInterest = getBorrowBalance(_cToken);
        _initiateFlashloan(
            _solo,
            _token,
            _cToken,
            Direction.Withdraw,
            0,
            borrowBalanceWithInterest
        );

        // COMP profits
        claimComp();
        address compAddress = getCompAddress();
        IERC20 comp = IERC20(compAddress);
        uint256 compBalance = comp.balanceOf(address(this));
        comp.transfer(msg.sender, compBalance);

        // this is the token send initally to this contract, plus net interest earned
        IERC20 token = IERC20(_token);
        uint256 tokenBalance = token.balanceOf(address(this));
        token.transfer(msg.sender, tokenBalance);
    }

    /// @notice callback function once user received amount from flashload
    /// @param sender dYdX contract
    /// @param account  borrower (this contract)
    /// @param data operation struct
    /// @dev studydefi naming convention
    function callFunction(
        address sender,
        Account.Info memory account,
        bytes memory data
    ) public {
        Operation memory operation = abi.decode(data, (Operation));

        if (operation.direction == Direction.Deposit) {
            // lend to Compound
            supply(
                operation.cToken,
                operation.amountProvided + operation.amountBorrowed
            );
            // set up collateral
            enterMarket(operation.cToken);
            // borrow
            borrow(operation.cToken, operation.amountBorrowed);
        } else {
            repayBorrow(operation.cToken, operation.amountBorrowed);
            uint256 cTokenBalance = getcTokenBalance(operation.cToken);
            // redeem underlying token to user smart contract
            redeem(operation.cToken, cTokenBalance);
        }
    }

    /// @notice
    /// @param _solo address of dYdX
    /// @param _token address of token to be borrowed
    /// @param _cToken address of cToken in Compound
    /// @param _direction borrow from Compound or reimburse the money
    /// @param _amountProvided how much user will provide (lend to Compound)
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
        //  1. Withdraw $
        //  2. Call callFunction(...)
        //  3. Deposit back $
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
        accountInfos[0] = _getAccountInfo();

        // initate the flashloan
        solo.operate(accountInfos, operations);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }
}

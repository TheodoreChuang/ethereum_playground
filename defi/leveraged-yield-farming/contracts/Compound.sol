pragma solidity ^0.5.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ICToken.sol";
import "./interfaces/IComptroller.sol";

/**
 * @notice Adapter for Compound
 */
contract Compound {
    IComptroller public comptroller;

    constructor(address _comptroller) public {
        comptroller = IComptroller(_comptroller);
    }

    function supply(address cTokenAddress, uint256 underlyingAmount) internal {
        CTokenInterface cToken = CTokenInterface(cTokenAddress);
        address underlyingAddress = cToken.underlying();
        IERC20(underlyingAddress).approve(cTokenAddress, underlyingAmount);
        uint256 result = cToken.mint(underlyingAmount);
        require(
            result == 0,
            "cToken#mint() failed. see Compound ErrorReporter.sol for details"
        );
    }

    function redeem(address cTokenAddress, uint256 cTokenAmount) internal {
        CTokenInterface cToken = CTokenInterface(cTokenAddress);
        uint256 result = cToken.redeem(cTokenAmount);
        require(
            result == 0,
            "cToken#redeem() failed. see Compound ErrorReporter.sol for more details"
        );
    }

    // indicate Compound on what token you want to use as colletral
    function enterMarket(address cTokenAddress) internal {
        address[] memory markets = new address[](1);
        markets[0] = cTokenAddress;
        uint256[] memory results = comptroller.enterMarkets(markets);
        require(
            results[0] == 0,
            "comptroller#enterMarket() failed. see Compound ErrorReporter.sol for details"
        );
    }

    function borrow(address cTokenAddress, uint256 borrowAmount) internal {
        CTokenInterface cToken = CTokenInterface(cTokenAddress);
        uint256 result = cToken.borrow(borrowAmount);
        require(
            result == 0,
            "cToken#borrow() failed. see Compound ErrorReporter.sol for details"
        );
    }

    function repayBorrow(address cTokenAddress, uint256 underlyingAmount)
        internal
    {
        CTokenInterface cToken = CTokenInterface(cTokenAddress);
        address underlyingAddress = cToken.underlying();
        IERC20(underlyingAddress).approve(cTokenAddress, underlyingAmount);
        uint256 result = cToken.repayBorrow(underlyingAmount);
        require(
            result == 0,
            "cToken#borrow() failed. see Compound ErrorReporter.sol for details"
        );
    }

    // claim the comp token reward as a participant on the compound protocal
    function claimComp() internal {
        comptroller.claimComp(address(this));
    }

    // get the address of comp token
    function getCompAddress() internal view returns (address) {
        return comptroller.getCompAddress();
    }

    function getcTokenBalance(address cTokenAddress)
        public
        view
        returns (uint256)
    {
        return CTokenInterface(cTokenAddress).balanceOf(address(this));
    }

    // No view keyword because borrowBalanceCurrent() can be called in a tx, and Solidity complains if view
    // return borrow amount+interest
    function getBorrowBalance(address cTokenAddress) public returns (uint256) {
        return
            CTokenInterface(cTokenAddress).borrowBalanceCurrent(address(this));
    }
}

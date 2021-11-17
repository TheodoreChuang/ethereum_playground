pragma solidity ^0.5.7;

/**
 * @notice Interface for interacting with Compound Comptroller
 */
interface IComptroller {
    function enterMarkets(address[] calldata cTokens)
        external
        returns (uint256[] memory);

    function claimComp(address holder) external;

    function getCompAddress() external view returns (address);
}

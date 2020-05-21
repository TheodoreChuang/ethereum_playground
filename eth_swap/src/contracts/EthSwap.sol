pragma solidity ^0.5.0;

import "./Token.sol";


contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint256 public redemptionRate = 100;

    event TokensPurchase(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );
    event TokensSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        uint256 tokenAmount = msg.value * redemptionRate;
        require(
            token.balanceOf(address(this)) >= tokenAmount,
            "EthSwap does not enough tokens to fullfill purchase"
        );

        token.transfer(msg.sender, tokenAmount);

        emit TokensPurchase(
            msg.sender,
            address(token),
            tokenAmount,
            redemptionRate
        );
    }

    function sellTokens(uint256 _tokenAmount) public {
        require(
            token.balanceOf(msg.sender) >= _tokenAmount,
            "Cannot sell more tokens than you own"
        );

        uint256 etherAmount = _tokenAmount / redemptionRate;
        require(
            address(this).balance >= etherAmount,
            "EthSwap does not enough ETH to complete sell"
        );

        token.transferFrom(msg.sender, address(this), _tokenAmount);
        msg.sender.transfer(etherAmount);

        emit TokensSold(
            msg.sender,
            address(token),
            _tokenAmount,
            redemptionRate
        );
    }
}

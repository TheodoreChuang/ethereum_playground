pragma solidity >=0.6.0 <0.7.0;


contract Lottery {
    address public manager;
    address payable[] public players;

    constructor() public {
        manager = msg.sender;
    }

    function _random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.number, players)
                )
            );
    }

    function enter() public payable {
        require(msg.value > .01 ether, "Not enough");
        players.push(msg.sender);
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function pickWinner() public onlyManager {
        uint256 index = _random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier onlyManager() {
        require(
            msg.sender == manager,
            "Only the manager can initial this action."
        );
        _;
    }
}

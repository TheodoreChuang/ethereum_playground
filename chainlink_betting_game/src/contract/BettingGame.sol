/** Contract created based on: https://docs.chain.link/docs/get-a-random-number
 *  Contract created only for educational purposes, by: github.com/dappuniversity
 *  You will need testnet ETH and LINK.
 *     - Rinkeby ETH faucet: https://faucet.rinkeby.io/
 *     - Rinkeby LINK faucet: https://rinkeby.chain.link/
 */

pragma solidity 0.6.6;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/master/evm-contracts/src/v0.6/VRFConsumerBase.sol";

contract BettingGame is VRFConsumerBase {
    uint256 internal fee;
    uint256 public randomResult;

    //Network: Rinkeby
    address constant VFRC_address = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B; // VRF Coordinator
    address constant LINK_address = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709; // LINK token

    //declaring 50% chance, (0.5*uint256)~
    uint256 constant half = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    bytes32
        internal constant keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;

    uint256 public gameId;
    uint256 public lastGameId;
    address payable public admin;
    mapping(uint256 => Game) public games;

    struct Game {
        uint256 id;
        uint256 bet;
        uint256 seed;
        uint256 amount;
        address payable player;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "caller is not the admin");
        _;
    }

    modifier onlyVFRC() {
        require(msg.sender == VFRC_address, "only VFRC can call this function");
        _;
    }

    event Withdraw(address admin, uint256 amount);
    event Received(address indexed sender, uint256 amount);
    event Result(
        uint256 id,
        uint256 bet,
        uint256 randomSeed,
        uint256 amount,
        address player,
        uint256 winAmount,
        uint256 randomResult,
        uint256 time
    );

    /**
     * Constructor inherits VRFConsumerBase
     */
    constructor() public VRFConsumerBase(VFRC_address, LINK_address) {
        fee = 0.1 * 10**18; // 0.1 LINK
        admin = msg.sender;
    }

    /**
     * Allow this contract to receive payments
     */
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    /**
     * Handle taking bets
     * bet=0 is low, represents dice valus 1-3
     * bet=1 is high, represents dice valus 4-6
     * Equal chances to win or lose the bet
     * On win, users receives 2x his betAmount
     * On lose, users receives nothing
     */
    function game(uint256 bet, uint256 seed) public payable returns (bool) {
        require(bet <= 1, "Error, bet can only be 0 or 1");
        require(msg.value != 0, "Error, value must be more than 0");
        require(
            address(this).balance >= msg.value,
            "Error insufficent vault balance"
        );

        games[gameId] = Game(gameId, bet, seed, msg.value, msg.sender);

        gameId = gameId + 1;

        getRandomNumber(seed);

        return true;
    }

    /**
     * Requests randomness from a user-provided seed
     */
    function getRandomNumber(uint256 userProvidedSeed)
        internal
        returns (bytes32 requestId)
    {
        require(
            LINK.balanceOf(address(this)) > fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee, userProvidedSeed);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        randomResult = randomness;

        //send final random value to get the verdict
        verdict(randomResult);
    }

    /**
     * Send rewards to the winners
     * settles bets since the last betting round
     */
    function verdict(uint256 random) public payable onlyVFRC {
        for (uint256 i = lastGameId; i < gameId; i++) {
            uint256 winAmount = 0;
            if (
                (random >= half && games[i].bet == 1) ||
                (random < half && games[i].bet == 0)
            ) {
                winAmount = games[i].amount * 2;
                games[i].player.transfer(winAmount);
            }
            emit Result(
                games[i].id,
                games[i].bet,
                games[i].seed,
                games[i].amount,
                games[i].player,
                winAmount,
                random,
                block.timestamp
            );
        }
        lastGameId = gameId;
    }

    /**
     * Withdraw LINK from this contract (admin)
     */
    function withdrawLink(uint256 amount) external onlyAdmin {
        require(LINK.transfer(msg.sender, amount), "Unable to transfer");
    }

    /**
     * Withdraw Ether from this contract (admin)
     */
    function withdrawEther(uint256 amount) external payable onlyAdmin {
        require(
            address(this).balance >= amount,
            "Error, contract has insufficent balance"
        );
        admin.transfer(amount);

        emit Withdraw(admin, amount);
    }
}

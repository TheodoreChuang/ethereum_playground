pragma solidity 0.6.0;
pragma experimental ABIEncoderV2;

contract MultiSigWallet {
    address[] public approvers;
    uint256 quorum;

    struct Transfer {
        uint256 id;
        uint256 amount;
        address payable to;
        uint256 approvals;
        bool sent;
    }

    Transfer[] public transfers;

    // approvers => (Transfer id => bool)
    mapping(address => mapping(uint256 => bool)) public approvals;

    constructor(address[] memory _approvers, uint256 _quorum) public {
        approvers = _approvers;
        quorum = _quorum;
    }

    function getApprovers() external view returns (address[] memory) {
        return approvers;
    }

    function getTransfers() external view returns (Transfer[] memory) {
        return transfers;
    }

    function createTransfer(uint256 _amount, address payable _to)
        external
        onlyApprover()
    {
        transfers.push(
            Transfer({
                id: transfers.length,
                amount: _amount,
                to: _to,
                approvals: 0,
                sent: false
            })
        );
    }

    function approveTransfer(uint256 id) external onlyApprover() {
        require(transfers[id].sent == false, "Transfer has already been sent");
        require(
            approvals[msg.sender][id] == false,
            "Transfer has already been approved"
        );

        approvals[msg.sender][id] == true;
        transfers[id].approvals++;

        if (transfers[id].approvals >= quorum) {
            transfers[id].to.transfer(transfers[id].amount);
            transfers[id].sent = true;
        }
    }

    receive() external payable {}

    modifier onlyApprover() {
        bool allowed = false;
        for (uint256 i = 0; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) {
                allowed = true;
            }
        }
        require(allowed == true, "only approvers allowed");
        _;
    }
}

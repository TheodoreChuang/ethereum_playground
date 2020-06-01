pragma solidity >=0.6.0 <0.7.0;


contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    Request[] public requests;

    modifier onlyManager() {
        require(
            msg.sender == manager,
            "Only the manager can initial this action."
        );
        _;
    }

    constructor(uint256 _minimumContribution) public {
        manager = msg.sender;
        minimumContribution = _minimumContribution;
    }

    function contribution() public payable {
        require(
            msg.value >= minimumContribution,
            "Contribution does not meet the minimum amount"
        );
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory _description,
        uint256 _value,
        address payable _recipient
    ) public onlyManager {
        Request memory newRequest = Request({
            description: _description,
            value: _value,
            recipient: _recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint256 _index) public {
        Request storage request = requests[_index];

        require(
            approvers[msg.sender],
            "Only contributors can approve requests"
        );
        require(
            !request.approvals[msg.sender],
            "You have already approved this request"
        );

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 _index) public onlyManager {
        Request storage request = requests[_index];

        require(!request.complete, "Request is already complete");
        require(
            request.approvalCount > (approversCount / 2),
            "Have not met the minimum number of approvals"
        );

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}

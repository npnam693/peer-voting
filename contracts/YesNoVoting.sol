// SPDX-License-Identifier: MIT
pragma solidity >0.8.9;

contract YesNoVoting{
    Proposal[] public proposals;
    uint256 proposalsCount;

    constructor() {
        proposalsCount = 0;
    }

    struct Proposal {
        uint256 id;
        string desc;
        uint256 acceptsCount;
        uint256 rejectsCount;
        address owner;
        bool isEnd;
        uint256 endTime;
    }

    mapping (address => mapping(uint256 => bool)) private isVoted;
    mapping (address => mapping(uint256 => bool)) private resultVoted;

    event CreateProposal(uint256);
    event VoteProposal(address, uint256, bool);
    event EndProposal(uint256, bool);

    function createProposal(string memory _desc, uint8 duration) public {
        proposals.push(Proposal({
            id: proposalsCount,
            desc: _desc,
            acceptsCount: 0,
            rejectsCount: 0,
            owner: msg.sender,
            isEnd: false,
            endTime: block.timestamp +  60 * 60 * duration
        }));
        proposalsCount += 1;

        emit CreateProposal(proposalsCount);
    }

    function voteProposal(uint256 id, bool vote) public {
        require(id <= proposalsCount, "Proposal's not exist.");
        require (proposals[id].owner != msg.sender, "Unable to vote by yourself");
        require (!isVoted[msg.sender][id], "You have vote for proposal yet.");

        isVoted[msg.sender][id] = true;
        if (vote) {
            proposals[id].acceptsCount += 1;
            resultVoted[msg.sender][id] = true;
        } else {
            proposals[id].rejectsCount += 1;
            resultVoted[msg.sender][id] = false;
        }

        emit VoteProposal(msg.sender, id, vote);
    }

    function endProposal(uint256 id) public {
        require(block.timestamp >= proposals[id].endTime, "Time is not up yet.");
        require(msg.sender == proposals[id].owner, "Only owner can finsish the proposal.");

        proposals[id].isEnd = true;
        emit EndProposal(id, proposals[id].acceptsCount > proposals[id].rejectsCount);
    }

    function getResultVote(uint256 id) public view returns (bool) {
        require(isVoted[msg.sender][id], "You have not vote for proposal yet");
        return resultVoted[msg.sender][id];
    }
}
// SPDX-License-Identifier: MIT
pragma solidity >0.8.9;

contract MultiChoiceVoting{
    Proposal[] public proposals;
    uint256 proposalsCount;

    constructor() {
        proposalsCount = 0;
    }

    struct Proposal {
        uint256 id;
        string desc;
        
        uint8 choiceAmount;
        string[] choices;
        uint256[] results;    

        address owner;
        bool isEnd;
        uint256 endTime;
    }

    mapping (address => mapping(uint256 => bool)) private isVoted;
    mapping (address => mapping(uint256 => uint8)) private resultVoted;

    event CreateProposal(uint256);
    event VoteProposal(address, uint256, uint8);
    event EndProposal(uint256, uint256[]);

    function createProposal(string memory _desc, uint8 _choiceAmount, string[] memory _choices, uint8 duration) public {
        proposals.push(Proposal({
            id: proposalsCount,
            desc: _desc,

            choiceAmount: _choiceAmount,
            choices: _choices,
            results: new uint256[](_choiceAmount),
            owner: msg.sender,
            isEnd: false,
            endTime: block.timestamp +  60 * 60 * duration
        }));
        proposalsCount += 1;

        emit CreateProposal(proposalsCount);
    }

    function voteProposal(uint256 id, uint8 vote) public {
        require(id <= proposalsCount, "Proposal's not exist.");
        require (proposals[id].owner != msg.sender, "Unable to vote by yourself");
        require (!isVoted[msg.sender][id], "You have vote for proposal yet.");

        resultVoted[msg.sender][id] = vote;
        isVoted[msg.sender][id] = true;
        
        emit VoteProposal(msg.sender, id, vote);
    }

    function endProposal(uint256 id) public {
        require(block.timestamp >= proposals[id].endTime, "Time is not up yet.");
        require(msg.sender == proposals[id].owner, "Only owner can finsish the proposal.");

        proposals[id].isEnd = true;

        emit EndProposal(id, proposals[id].results);
    }

    function getResultVote(uint256 id) public view returns (uint8) {
        require(isVoted[msg.sender][id], "You have not vote for proposal yet");

        return resultVoted[msg.sender][id];
    }
}
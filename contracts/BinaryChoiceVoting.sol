// SPDX-License-Identifier: MIT
pragma solidity >0.8.9;

/**
 * @title BinaryChoiceVoting
 * @author npnam693
 * @notice Smart Contract for conducting a voting with two option (Yes/No)
 */
contract BinaryChoiceVoting{
    /**
     * @dev List proposals in contracts.
     */
    Proposal[] public proposals;
    

    /**
     * @dev The number of proposals in contract.
     */
    uint256 proposalsCount;


    /**
     * @dev Constructor of YesNoVoting contract with the number of proposals set to zero.
     */
    constructor() {
        proposalsCount = 0;
    }


    /**
     * @dev Structure of a proposal.
     * @param id The id of proposal.
     * @param desc The description of proposal.
     * @param acceptsCount The number of accepts vote.
     * @param rejectsCount The number of rejects vote.
     * @param owner The address of owner of this proposal.
     * @param isEnd The boolean property to check whether contract has over.
     * @param endTime The time when contract can be over.
     */
    struct Proposal {
        uint256 id;
        string title;
        string desc;
        uint256 acceptsCount;
        uint256 rejectsCount;
        address owner;
        bool isEnd;

        uint256 startTime;
        uint256 endTime;
    }
    
    event CreateProposal(uint256);
    event VoteProposal(address, uint256, bool);
    event EndProposal(uint256, bool);


    /**
     * @dev Mapping to check whether an address has voted for a proposal - [address][proposalId].
     */
    mapping (address => mapping(uint256 => bool)) private isVoted;


    /**
     * @dev Mapping to check whether an address has voted for a proposal and the result of vote - [address][proposalId].
     */
    mapping (address => mapping(uint256 => bool)) private resultVoted;


    /**
     * @dev Create a new proposal.
     * @param _title The title of proposal 
     * @param _desc Description of proposal
     * @param duration Duration of proposal
     */
    function createProposal(string memory _title, string memory _desc, uint256 duration) public {
        proposals.push(Proposal({
            id: proposalsCount,
            title: _title,
            desc: _desc,
            acceptsCount: 0,
            rejectsCount: 0,
            owner: msg.sender,
            isEnd: false,
            startTime: block.timestamp,
            endTime: block.timestamp +  60 * 60 * duration
        }));
        proposalsCount += 1;

        emit CreateProposal(proposalsCount);
    }


    /**
     * @dev Vote for a proposal.
     * @param id ID of the prososal to vote
     * @param vote Option of vote (true: accept, false: reject)
     */
    function voteProposal(uint256 id, bool vote) public {
        require(id <= proposalsCount, "Proposal's not exist.");
        require (!isVoted[msg.sender][id], "You have vote for proposal yet.");
        require (proposals[id].isEnd, "Voting time has expired.");

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



    /**
     * @dev The owner finalize a proposal.
     * @param id ID of the proposal to end
     */
    function endProposal(uint256 id) public {
        require(block.timestamp >= proposals[id].endTime, "Time is not up yet.");
        require(msg.sender == proposals[id].owner, "Only owner can finsish the proposal.");

        proposals[id].isEnd = true;
        emit EndProposal(id, proposals[id].acceptsCount > proposals[id].rejectsCount);
    }


    /**
     * @dev Get voting result of msg.sender for a proposal. 
     * @param id ID of the proposal to get
     * @return The result of your vote (true: accept, false: reject)
     */
    function getYourVoted(uint256 id) public view returns (bool) {
        require(isVoted[msg.sender][id], "You have not vote for proposal yet");
        return resultVoted[msg.sender][id];
    }


    /**
     * @dev Get the number of accept voting in a proposal.
     * @param id ID of the proposal to get
     */
    function getAcceptCount(uint256 id) public view returns (uint256) {
        return proposals[id].acceptsCount;
    }


    /**
     * @dev Get the number of reject voting in a proposal.
     * @param id ID of the proposal to get
     */
    function getRejectCount(uint256 id) public view returns (uint256) {
        return proposals[id].rejectsCount;
    }
}
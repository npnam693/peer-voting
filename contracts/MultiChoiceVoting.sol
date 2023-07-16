// SPDX-License-Identifier: MIT
pragma solidity >0.8.9;

contract MultiChoiceVoting{
    /**
     * @dev List proposals in contracts.
     */
    Proposal[] public proposals;
    
    /**
     * @dev The number of proposals in contract.
     */
    uint256 public proposalsCount;


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
     * @param choiceAmount The number of choice in proposal.
     * @param choices The list of choice in proposal.
     * @param results The results of proposal in list count voting.
     * @param owner The address of owner of this proposal.
     * @param isEnd The boolean property to check whether contract has over.
     * @param endTime The time when contract can be over.
     */
    struct Proposal {
        uint256 id;
        string title;
        string desc;
        
        uint256 choiceAmount;
        string[] choices;
        uint256[] results;    

        address owner;
        bool isEnd;
        uint256 startTime;
        uint256 endTime;
    }

    /**
     * @dev Mapping to check whether an address has voted for a proposal - [address][proposalId].
     */
    mapping (address => mapping(uint256 => bool)) private isVoted;
    
    
    /**
     * @dev Mapping to check whether an address has voted for a proposal and the result of vote - [address][proposalId].
     */
    mapping (address => mapping(uint256 => uint256)) private resultVoted;

    event CreateProposal(uint256);
    event VoteProposal(address, uint256, uint256);
    event EndProposal(uint256, uint256[]);

    /**
     * @dev Create a new proposal.
     * @param _title The title of proposal 
     * @param _desc Description of proposal
     * @param duration Duration of proposal
     */
    function createProposal(string memory _title, string memory _desc, uint256 _choiceAmount, string[] memory _choices, uint256 duration) public {
        proposals.push(Proposal({
            id: proposalsCount,
            title: _title,
            desc: _desc,

            choiceAmount: _choiceAmount,
            choices: _choices,
            results: new uint256[](_choiceAmount),
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
     * @param id The id of proposal to vote.
     * @param vote The vote of user option follow index of choice.
     */
    function voteProposal(uint256 id, uint256 vote) public {
        require(id <= proposalsCount, "Proposal's not exist.");
        require (!isVoted[msg.sender][id], "You have vote for proposal yet.");

        resultVoted[msg.sender][id] = vote;
        isVoted[msg.sender][id] = true;
        proposals[id].results[vote] += 1; 
        
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

        emit EndProposal(id, proposals[id].results);
    }
    
    /**
     * @dev Get voting result of msg.sender for a proposal. 
     * @param id ID of the proposal to get
     * @return The result of your vote (true: accept, false: reject)
     */
    function getYourVote(uint256 id) public view returns (uint256) {
        require(isVoted[msg.sender][id], "You have not vote for proposal yet");
        return resultVoted[msg.sender][id];
    }


    /**
     * @dev Get the result of one option's proposals in contract.
     * @param id ID of the proposal to get.
     * @param choice The index of choice in proposal.
     * @return The number of proposals in contract.
     */
    function getResultProposal(uint256 id, uint256 choice) public view returns (uint256) {
        require(id < proposalsCount, "Proposal is not exist.");
        return proposals[id].results[choice];
    }


    /**
     * @dev Get the a one choice of proposals in contract.
     * @param id ID of the proposal to get.
     * @param choice The index of choice in proposal.
     * @return The content of choice in proposal.
     */
    function getChoiceProposal(uint256 id, uint256 choice) public view returns (string memory) {
        require(id < proposalsCount, "Proposal is not exist.");
        return proposals[id].choices[choice];
    }
}
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

//functions :
//1. nominate
//2. vote
//3. getPartyDetails
//4. declareResults
//5. getWinner

//modifiers:
//1. ifVotingPeriod
//2. ifNotVotedYet
//3. ifNomineeExists
//4. ifContractOnwer
//5. ifNotNominated
//6. ifResultsDeclared
//7. ifNominationPeriod
//8. ifVotingEnded

//events:
//1. Nominated

// A Nominee object contains the owner's address, the party name and the number of votes received by the nominee
struct Nominee{
    address owner;
    string partyName;
    uint votes;
}

contract Voting{
    mapping(address => uint) votes; //voter details (voter address => voted nominee id)
    mapping(uint => Nominee) nominees; //nominee details (nominee id => nominee details)
    mapping(address => bool) nomineesStatus; //nominee status (nominee adress => status of participation)
    uint votingProcessStartDate; //start timestamp of voting
    uint nominationPeriod; //nomination period in seconds
    uint votingPeriod; //voting period in seconds
    bool resultsDeclared; //flag to check whether the results have been declared
    uint numNominees; //the number of nominees
    address contractOwner; //contract owner address for controlling the voting system
    uint winnerId; //id of the nominee who won the election
    string partyConductingVoting; //party name responsible for the voting
    
    constructor(uint _nominationPeriod,uint _votingPeriod, string memory partyName){
        votingProcessStartDate = block.timestamp; //voting process begins
        nominationPeriod = _nominationPeriod * 60; //converting into seconds
        votingPeriod = _votingPeriod * 60; //converting into seconds
        partyConductingVoting = partyName;
        contractOwner = msg.sender;
    }
    
    //to check if the current time frame supports voting 
    modifier ifVotingPeriod{
        require(block.timestamp - votingProcessStartDate > nominationPeriod,"Voting Not Started Yet!"); //not begun
        require(block.timestamp < votingProcessStartDate + nominationPeriod + votingPeriod, "Voting Process Already Ended!"); //ended
        _;
    }
    
    //to check if the voter has already voted
    modifier ifNotVotedYet{
        require(votes[msg.sender]==0,"Already Voted!"); //already voted
        _;
    }
    
    //to check if the a nominee with a given id exists
    modifier ifNomineeExists(uint id){
        require(nominees[id].owner!=address(0),"No such Nominee found!"); //not present
        _;
    }
    
    //to check if the current user is the owner of the contract
    modifier ifContractOnwer{
        require(msg.sender == contractOwner,"Only the contract owner is allowed to declare results!");//not owner
        _;
    }
    
    //to check if the currnt voter is a nominee, as they can't vote
    modifier ifNotNominee{
        require(nomineesStatus[msg.sender]!=true,"Nominees cannot vote!");//nominee
        _;
    }
    
    //the function to vote, it takes the id of the nominee
    function vote(uint id) public ifVotingPeriod ifNotVotedYet ifNomineeExists(id) ifNotNominee returns (bool){
        votes[msg.sender] = id; //voted
        nominees[id].votes += 1; //increase the votes
        return true;
    }
    
    //the function to get party details, it takes the id of the nominee
    function getPartyDetails(uint id) public view returns (string memory partyName){
        if(nominees[id].owner == address(0))return "No Such Party"; //no such party
        else return nominees[id].partyName; //returns party name
    }
    
    //the function to check if the nominee has already nominated
    modifier ifNotNominated{
        require(nomineesStatus[msg.sender]==false,"Already Nominated!");//nominated
        _;
    }
    
    //the function to check whether the results have been declared
    modifier ifResultsDeclared{
        require(resultsDeclared == true,"Results have not been declared yet!");//declared
        _;
    }
    
    //the function to whether the current time frame supports nomination
    modifier ifNominationPeriod{
        require(block.timestamp - votingProcessStartDate < nominationPeriod,"Nomination Period Ended!");
        _;
    }
    
    //log of sucessfully nominated users
    event Nominated(address indexed nominee, bool status);
    
    //the function to nominate
    function nominate(string memory partyName) public ifNotNominated ifNominationPeriod returns (bool){
        numNominees++; //increase the number of nominees
        Nominee storage newNominee = nominees[numNominees]; //new nominee
        newNominee.owner = msg.sender;
        newNominee.partyName = partyName;
        nomineesStatus[msg.sender]=true; //update the status of nominee to updated
        emit Nominated(msg.sender,true); //emit the event of successfull nomination
        return true;
    }
    
    //the function to get the winner details => id of the winner, party name and the number of votes received
    function getWinner() public view ifResultsDeclared returns (uint id,string memory partyName,uint votesGained){
        return (winnerId,nominees[winnerId].partyName,nominees[winnerId].votes);
    }
    
    //to check whether the voting ended or not, so that results can be declared
    modifier ifVotingEnded{
        require(block.timestamp > votingProcessStartDate+nominationPeriod+votingPeriod, "Voting Process is still active!");//voting going on
        _;
    }
    
    //function to declare the results
    function declareResults() public ifContractOnwer ifVotingEnded returns (bool){
        winnerId = 1; //assign the first nominee as the initial winner
        for(uint i=2;i<=numNominees;i++){
            //if the current nominee has more votes, update the winner
            if(nominees[i].votes > nominees[winnerId].votes)winnerId = i;
        }
        //update the status of the results as declared
        resultsDeclared = true;
        return true;
    }
}
pragma solidity 0.5.4;

contract VotingSystem {

    struct Voter {
        string name;
        // add more information

        bool valid;
    }

    struct Candidate {
        string name;
        // add more information

        uint votes;
    }

    struct TimeFrame {
        uint256 start;
        uint256 end;
    }

    mapping (bytes32 => Candidate) candidates;
    mapping (bytes32 => Voter) voters;
    TimeFrame candidateRegistration = TimeFrame(0, 0);
    TimeFrame voterRegistration = TimeFrame(0, 0);
    TimeFrame votingTimeFrame = TimeFrame(0, 0);

    modifier onlyOnCandidateRegistrationTimeFrame() {
        require(
            candidateRegistration.start <= now &&
            now <= candidateRegistration.end,
            "Candidates Registration Prohibited"
        );
        _;
    }

    modifier onlyOnVoterRegistrationTimeFrame() {
        require(
            voterRegistration.start <= now &&
            now <= voterRegistration.end,
            "Voters Registration Prohibited"
        );
        _;
    }

    modifier onlyOnVotingTimeFrame() {
        require(
            votingTimeFrame.start <= now &&
            now <= votingTimeFrame.end,
            "Voting Prohibited"
        );
        _;
    }

    modifier onlyValidVoter(string memory voterName) {
        require(
            voters[strHash(voterName)].valid == true,
            "You are not a Valid Voter"
        );
        _;
    }

    // Kill Contract on Election End;

    function registerCandidate(string calldata name) external // onlyOnCandidateRegistrationTimeFrame
    {
        candidates[strHash(name)] = Candidate(name, 0);
    }

    function registerVoter(string calldata name) external // onlyOnVoterRegistrationTimeFrame
    {
        voters[strHash(name)] = Voter(name, true);
    }

    function voteCandidate(string calldata candidateNamename, string calldata voterName)
        external
        onlyValidVoter(voterName)
    // onlyOnVotingTimeFrame
    {
        candidates[strHash(candidateNamename)].votes += 1;
    }

    function getVotes(string calldata name) external view returns (uint256) {
        return candidates[strHash(name)].votes;
    }

    function strHash(string memory str) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(str));
    }
}
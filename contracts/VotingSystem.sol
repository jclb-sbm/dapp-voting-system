pragma solidity 0.5.4;

contract VotingSystem {

    struct Voter {
        string name;
        // add more information

        bool valid;
    }

    struct Candidate {
        string name;
        string imgHash;
        // add more information

        uint votes;
    }

    struct TimeFrame {
        uint256 start;
        uint256 end;
    }

    Candidate[] candidates;
    Voter[] voters;
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

    modifier onlyValidVoter(string memory _voterName) {
        (, bool valid) = getVoterByName(_voterName);

        require(
            valid == true,
            "You are not a Valid Voter"
        );
        _;
    }

    // Kill Contract on Election End;


    function registerCandidate(string memory _name, string memory _imgHash)
        public
        // onlyOnCandidateRegistrationTimeFrame
    {
        candidates.push(Candidate(_name, _imgHash, 0));
    }

    function registerVoter(string memory _name)
        public
        // onlyOnVoterRegistrationTimeFrame
    {
        voters.push(Voter(_name, true));
    }

    function voteCandidate(string memory _name, string memory _voterName)
        public
        onlyValidVoter(_voterName)
        // onlyOnVotingTimeFrame
    {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (strEquals(candidates[i].name, _name)) {
                candidates[i].votes += 1;
            }
        }
    }

    function getCandidateByIndex(uint256 _index)
        public
        view
        returns (string memory, string memory, uint256)
    {

        return
        (
            candidates[_index].name,
            candidates[_index].imgHash,
            candidates[_index].votes
        );


    }

    function getCandidateByName(string memory _name)
        public
        view
        returns (string memory, string memory, uint256)
    {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (strEquals(candidates[i].name, _name)) {

                return
                (
                    candidates[i].name,
                    candidates[i].imgHash,
                    candidates[i].votes
                );

            }
        }
    }

    function getCandidateCount()
        public
        view
        returns (uint256)
    {
        return candidates.length;
    }


    function getVotes(string memory _name)
        public
        view
        returns (uint256)
    {
        (, , uint256 votes) = getCandidateByName(_name);
        return votes;
    }

    function getVoterByIndex(uint256 _index)
        public
        view
        returns (string memory, bool)
    {

        return
        (
            voters[_index].name,
            voters[_index].valid
        );

    }

    function getVoterByName(string memory _name)
        public
        view
        returns (string memory, bool)
    {
        for (uint256 i = 0; i < voters.length; i++) {
            if (strEquals(voters[i].name, _name)) {

                return
                (
                    voters[i].name,
                    voters[i].valid
                );

            }
        }
    }

    function getVoterCount()
        public
        view
        returns (uint256)
    {
        return voters.length;
    }

    function strHash(string memory str)
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(str));
    }

    function strEquals(string memory a, string memory b)
        private
        pure
        returns (bool)
    {
        return strHash(a) == strHash(b);
    }


    //TODO
    // Set Voter Validity (after voting must be invalid)
    // Check If Voter is Registerd



}
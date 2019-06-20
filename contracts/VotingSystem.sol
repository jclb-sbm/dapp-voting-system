pragma solidity 0.5.4;

contract VotingSystem {

    struct Voter {
        bytes32 name;
        // add more information

        bool valid;
    }

    struct Candidate {
        bytes32 name;
        string imgHash; // TODO: change to struct {bytes32 hash; uint8 hash_function; uint8 size}

        // add more information

        uint votes;
    }

    struct TimeFrame {
        uint256 start;
        uint256 end;
    }

    TimeFrame candidateRegistration = TimeFrame(0, 0);
    TimeFrame voterRegistration = TimeFrame(0, 0);
    TimeFrame votingTimeFrame = TimeFrame(0, 0);

    Candidate[] presCandidates;
    Candidate[] vicePresCandidates;

    Voter[] voters;

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

    modifier onlyValidVoter(bytes32 _voterName) {
        (, bool valid) = getVoterByName(_voterName);

        require(
            valid == true,
            "You are not a Valid Voter"
        );
        _;
    }

    function registerCandidate(bytes32 _name, string memory _imgHash, string memory _candidacy)
        public
        // onlyOnCandidateRegistrationTimeFrame
    {
        if (strEquals(_candidacy, 'President')) {
            presCandidates.push(Candidate(_name, _imgHash, 0));
        }
        else if (strEquals(_candidacy, 'Vice President')) {
            vicePresCandidates.push(Candidate(_name, _imgHash, 0));
        }
    }

    function registerVoter(bytes32 _name)
        public
        // onlyOnVoterRegistrationTimeFrame
    {
        voters.push(Voter(_name, true));
    }

    function votePresident(bytes32 _candidateName) private  {
        for (uint256 i = 0; i < presCandidates.length; i++) {
            if (presCandidates[i].name == _candidateName) {
                presCandidates[i].votes += 1;
            }
        }
    }

    function voteVicePresident(bytes32 _candidateName) private {
        for (uint256 i = 0; i < vicePresCandidates.length; i++) {
            if (vicePresCandidates[i].name == _candidateName) {
                vicePresCandidates[i].votes += 1;
            }
        }
    }

    function voteCandidate(bytes32 _candidateName, string memory _candidacy, bytes32 _voterName)
        public
        onlyValidVoter(_voterName)
        // onlyOnVotingTimeFrame
    {
        if (strEquals(_candidacy, 'President'))
        {
            votePresident(_candidateName);
        }
        else if (strEquals(_candidacy, 'Vice President')) {
            voteVicePresident(_candidateName);
        }
    }

    function getCandidateByIndex(uint256 _index, string memory _candidacy)
        public
        view
        returns (bytes32, string memory, uint256)
    {
        if (strEquals(_candidacy, 'President'))
        {
            return
            (
                presCandidates[_index].name,
                presCandidates[_index].imgHash,
                presCandidates[_index].votes
            );
        }
        else if (strEquals(_candidacy, 'Vice President'))
        {
            return
            (
                vicePresCandidates[_index].name,
                vicePresCandidates[_index].imgHash,
                vicePresCandidates[_index].votes
            );
        }
    }

    function getCandidateByName(bytes32 _name, string memory _candidacy)
        public
        view
        returns (bytes32, string memory, uint256)
    {
        if (strEquals(_candidacy, 'President')) {
            return getCandidateFromList(_name, presCandidates);
        }
        else if (strEquals(_candidacy, 'Vice President')) {
            return getCandidateFromList(_name, vicePresCandidates);
        }
        else {
            return ("No", "Candidate", 1);
        }

    }

    function getPresCount() public view returns (uint256) {
        return presCandidates.length;
    }

    function getVicePresCount() public view returns (uint256)
    {
        return vicePresCandidates.length;
    }


    function getVotes(bytes32 _name, string memory _candidacy)
        public
        view
        returns (uint256)
    {
        (, , uint256 votes) = getCandidateByName(_name, _candidacy);
        return votes;
    }

    function getVoterByIndex(uint256 _index)
        public
        view
        returns (bytes32, bool)
    {

        return
        (
            voters[_index].name,
            voters[_index].valid
        );

    }

    function getVoterByName(bytes32 _name)
        public
        view
        returns (bytes32, bool)
    {
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i].name == _name) {

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

    function getCandidateFromList(bytes32 _name, Candidate[] memory _candidateList)
        private
        pure
        returns (bytes32, string memory, uint256)
    {
        for (uint256 i = 0; i < _candidateList.length; i++) {
            if (_candidateList[i].name == _name) {
                return
                (
                    _candidateList[i].name,
                    _candidateList[i].imgHash,
                    _candidateList[i].votes
                );
            }
        }
        return ("Not", 'Found', 1);
    }

    function strEquals(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    //TODO
    // Set Voter Validity (after voting must be invalid)
    // Check If Voter is Registerd
}
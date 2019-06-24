pragma solidity 0.5.4;

contract VotingSystem {

    struct Voter {
        bytes32 name;
        // add more information

        bool validity;
    }

    struct Candidate {
        bytes32 name;
        bytes32 partyList;
        // add more information

        string imgHash;
        // Improvement:
        //
        // imgHash {
        //      bytes32 hash
        //      uint8 hash_function
        //      uint8 size
        // }

        uint24 votes;
    }

    struct TimeFrame {
        uint256 start;
        uint256 end;
    }

    TimeFrame registrationPhase;
    TimeFrame votingPhase;

    Candidate[] presCandidates;
    Candidate[] vicePresCandidates;
    Candidate[] senCandidates;

    Voter[] voters;

    address electionAdmin;

    modifier onlyElectionAdmin() {
        require(electionAdmin == msg.sender, "You don't have administration rights");
        _;
    }

    modifier onlyUnregisteredVoter(bytes32 _voterName) {
        for (uint24 i = 0; i < voters.length; i++) {
            require(voters[i].name != _voterName, 'You are already registered as a voter');
        }
        _;
    }

    modifier onlyUnregisteredCandidate(bytes32 _voterName, string memory _candidacy) {
        if (strEquals(_candidacy, 'President')) {
            for (uint8 i = 0; i < presCandidates.length; i++) {
                require(presCandidates[i].name != _voterName, 'You are already registered as a candidate');
            }
        }
        else if (strEquals(_candidacy, 'Vice President')) {
            for (uint8 i = 0; i < vicePresCandidates.length; i++) {
                require(vicePresCandidates[i].name != _voterName, 'You are already registered as a candidate');
            }
        }
        else if (strEquals(_candidacy, 'Senator')) {
            for (uint8 i = 0; i < senCandidates.length; i++) {
                require(senCandidates[i].name != _voterName, 'You are already registered as a candidate');
            }
        }
        _;
    }

    modifier onlyOnRegistrationTimeFrame() {
        require(
            registrationPhase.start <= now &&
            now <= registrationPhase.end,
            "Registration Prohibited"
        );
        _;
    }

    modifier onlyOnVotingTimeFrame() {
        require(
            votingPhase.start <= now &&
            now <= votingPhase.end,
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

    constructor(uint8 daysTillRegistrationStart, uint8 daysTillRegistrationEnd,
                uint8 daysTillVotingStart, uint8 dayTillsVotingEnd) public {

        uint256 registrationStart = daysTillRegistrationStart * 1 days;
        uint256 registrationEnd = daysTillRegistrationEnd * 1 days;

        uint256 votingStart = daysTillVotingStart * 1 days;
        uint256 votingEnd = dayTillsVotingEnd * 1 days;

        registrationPhase = TimeFrame(now + registrationStart, now + registrationEnd);
        votingPhase = TimeFrame(now + votingStart, now + votingEnd);
        electionAdmin = msg.sender;
    }

    function resetElection(uint8 daysTillRegistrationStart, uint8 daysTillRegistrationEnd,
                           uint8 daysTillVotingStart, uint8 dayTillsVotingEnd) public onlyElectionAdmin {

        uint256 registrationStart = daysTillRegistrationStart * 1 days;
        uint256 registrationEnd = daysTillRegistrationEnd * 1 days;

        uint256 votingStart = daysTillVotingStart * 1 days;
        uint256 votingEnd = dayTillsVotingEnd * 1 days;

        registrationPhase = TimeFrame(now + registrationStart, now + registrationEnd);
        votingPhase = TimeFrame(now + votingStart, now + votingEnd);

        delete presCandidates;
        delete vicePresCandidates;
        delete senCandidates;
        delete voters;

    }

    function registerCandidate(bytes32 _name, bytes32 _partyList, string memory _imgHash, string memory _candidacy)
        public
        // onlyOnCandidateRegistrationTimeFrame
    {
        if (strEquals(_candidacy, 'President')) {
            presCandidates.push(Candidate(_name, _partyList, _imgHash, 0));
        }
        else if (strEquals(_candidacy, 'Vice President')) {
            vicePresCandidates.push(Candidate(_name, _partyList, _imgHash, 0));
        }
        else if (strEquals(_candidacy, 'Senator')) {
            senCandidates.push(Candidate(_name, _partyList, _imgHash, 0));
        }
    }

    function registerVoter(bytes32 _name)
        public
        // onlyOnRegistrationTimeFrame
    {
        voters.push(Voter(_name, true));
    }

    function votePresident(bytes32 _candidateName) private  {
        for (uint8 i = 0; i < presCandidates.length; i++) {
            if (presCandidates[i].name == _candidateName) {
                presCandidates[i].votes += 1;
            }
        }
    }

    function voteVicePresident(bytes32 _candidateName) private {
        for (uint8 i = 0; i < vicePresCandidates.length; i++) {
            if (vicePresCandidates[i].name == _candidateName) {
                vicePresCandidates[i].votes += 1;
            }
        }
    }

    function voteSenator(bytes32 _candidateName) private {
        for (uint8 i = 0; i < senCandidates.length; i++) {
            if (senCandidates[i].name == _candidateName) {
                senCandidates[i].votes += 1;
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
        else if (strEquals(_candidacy, 'Vice President')) {
            voteSenator(_candidateName);
        }
    }

    function getCandidateByIndex(uint8 _index, string memory _candidacy)
        public
        view
        returns (bytes32, bytes32, string memory, uint24)
    {
        if (strEquals(_candidacy, 'President'))
        {
            return
            (
                presCandidates[_index].name,
                presCandidates[_index].partyList,
                presCandidates[_index].imgHash,
                presCandidates[_index].votes
            );
        }
        else if (strEquals(_candidacy, 'Vice President'))
        {
            return
            (
                vicePresCandidates[_index].name,
                vicePresCandidates[_index].partyList,
                vicePresCandidates[_index].imgHash,
                vicePresCandidates[_index].votes
            );
        }
        else if (strEquals(_candidacy, 'Vice President'))
        {
            return
            (
                senCandidates[_index].name,
                senCandidates[_index].partyList,
                senCandidates[_index].imgHash,
                senCandidates[_index].votes
            );
        }
    }

    function getCandidateByName(bytes32 _name, string memory _candidacy)
        public
        view
        returns (bytes32, bytes32, string memory, uint24)
    {
        if (strEquals(_candidacy, 'President')) {
            return getCandidateFromList(_name, presCandidates);
        }
        else if (strEquals(_candidacy, 'Vice President')) {
            return getCandidateFromList(_name, vicePresCandidates);
        }
        else if (strEquals(_candidacy, 'Senator'))
        {
            return getCandidateFromList(_name, senCandidates);
        }
    }

    function getPresCount() public view returns (uint8) {
        return uint8(presCandidates.length);
    }

    function getVicePresCount() public view returns (uint8)
    {
        return uint8(vicePresCandidates.length);
    }

    function getSenCount() public view returns (uint8) {
        return uint8(senCandidates.length);
    }

    function getVotes(bytes32 _name, string memory _candidacy)
        public
        view
        returns (uint256)
    {
        (, , , uint24 votes) = getCandidateByName(_name, _candidacy);
        return votes;
    }

    function getVoterByIndex(uint24 _index)
        public
        view
        returns (bytes32, bool)
    {

        return
        (
            voters[_index].name,
            voters[_index].validity
        );

    }

    function getVoterByName(bytes32 _name)
        public
        view
        returns (bytes32, bool)
    {
        for (uint24 i = 0; i < voters.length; i++) {
            if (voters[i].name == _name) {

                return
                (
                    voters[i].name,
                    voters[i].validity
                );

            }
        }
    }

    function getVoterCount()
        public
        view
        returns (uint24)
    {
        return uint24(voters.length);
    }

    function invalidateVoter(bytes32 _voterName) public {
        for (uint24 i = 0; i < voters.length; i++) {
            if (voters[i].name == _voterName) {
                voters[i].validity = false;
            }
        }
    }

    function getCandidateFromList(bytes32 _name, Candidate[] memory _candidateList)
        private
        pure
        returns (bytes32, bytes32, string memory, uint24)
    {
        for (uint256 i = 0; i < _candidateList.length; i++) {
            if (_candidateList[i].name == _name) {
                return
                (
                    _candidateList[i].name,
                    _candidateList[i].partyList,
                    _candidateList[i].imgHash,
                    _candidateList[i].votes
                );
            }
        }
    }

    function strEquals(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
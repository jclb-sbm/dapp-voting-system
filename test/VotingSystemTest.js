const VotingSystem = artifacts.require("VotingSystem");
const { time, expectRevert } = require('openzeppelin-test-helpers');

contract("VotingSystemTest", accounts => {

    it('Reset Election without Admin', async () => {
        let contract = await VotingSystem.deployed();

        try {
            await contract.resetElection(0, 0, 0, 0, {from: accounts[1]});
            assert.fail();
        }
        catch(err) {
            assert.equal(err.message.slice(83, err.message.length),
                         "You don't have administration rights.");
        }
    });

    it('Reset Election with Admin', async () => {
        let contract = await VotingSystem.deployed();

        let daysTillRegistrationStart = 1;
        let daysTillRegistrationEnd = 2;
        let daysTillVotingStart = 3;
        let dayTillsVotingEnd = 4;

        await contract.resetElection(daysTillRegistrationStart, daysTillRegistrationEnd,
                                     daysTillVotingStart, dayTillsVotingEnd);

        let voterCount = await contract.getVoterCount();
        let presCount = await contract.getPresCount();
        let vicePresCount = await contract.getVicePresCount();
        let senCount = await contract.getSenCount();

        assert.equal(voterCount, 0);
        assert.equal(presCount, 0);
        assert.equal(vicePresCount, 0);
        assert.equal(senCount, 0);
    });

    it('Pre Registration Phase - Register Candidates and Voters Should Expect VM Error' , async () => {
        let contract = await VotingSystem.deployed();

        try {
            await contract.registerVoter(web3.utils.asciiToHex('Early Voter Name'));
            assert.fail();
        }
        catch(err) {
            assert.equal(err.message.slice(83, err.message.length),
                         'Registration Prohibited.');
        }

        try {
            await contract.registerCandidate(web3.utils.asciiToHex('Early Candidate Name'),
                                             web3.utils.asciiToHex('Early Candidate Party List'),
                                             'Image Hash',
                                             'President');
            assert.fail();
        }
        catch(err) {
            assert.equal(err.message.slice(83, err.message.length),
                         'Registration Prohibited.');
        }
    });

    it('Registration Phase - Register 1st Voter and Get Voter By Index 0', async () => {
        await time.increase(time.duration.days(1));

        let contract = await VotingSystem.deployed();

        await contract.registerVoter(web3.utils.asciiToHex('1st Voter Name'));

        let actualVoter = await contract.getVoterByIndex(0);
        let actualName = web3.utils.hexToUtf8(actualVoter[0]);
        let actualValidity = actualVoter[1];

        let expectedName = '1st Voter Name';
        let expectedValidity = true;

        assert.equal(expectedName, actualName, 'Unexpected Voter Name');
        assert.equal(expectedValidity, actualValidity, 'Unexpected Voter Validity');
    });

    it('Registration Phase - Register Voter and Get Voter By Name', async () => {
        let contract = await VotingSystem.deployed();

        let actualVoter = await contract.getVoterByName(web3.utils.asciiToHex('1st Voter Name'));
        let actualName = web3.utils.hexToUtf8(actualVoter[0]);
        let actualValidity = actualVoter[1];

        let expectedName = '1st Voter Name';
        let expectedValidity = true;

        assert.equal(expectedName, actualName, 'Unexpected Voter Name');
        assert.equal(expectedValidity, actualValidity, 'Unexpected Voter Validity');
    });

    it('Registration Phase - Register Same Voter and Expect VM Error', async () => {
        let contract = await VotingSystem.deployed();

        // Use current version of Ganache (v2.1.6) doesn't return revert reason. Use v2.2.0 or newer.
        // await expectRevert(contract.registerVoter(web3.utils.asciiToHex('1st Voter Name')),"You are already registered as a voter.");

        // Workaround
        try {

            await contract.registerVoter(web3.utils.asciiToHex('1st Voter Name'));
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are already registered as a voter.');
        }

    });

    it('Registration Phase - Register 3 New Voters and Get Last Voter By Last Index', async () => {
        let contract = await VotingSystem.deployed();

        await contract.registerVoter(web3.utils.asciiToHex('2nd Voter Name'));
        await contract.registerVoter(web3.utils.asciiToHex('3rd Voter Name'));
        await contract.registerVoter(web3.utils.asciiToHex('Last Voter Name'));

        let voterCount = await contract.getVoterCount();

        let actualVoter = await contract.getVoterByIndex(voterCount - 1);
        let actualName = web3.utils.hexToUtf8(actualVoter[0]);
        let actualValidity = actualVoter[1];

        let expectedName = 'Last Voter Name';
        let expectedValidity = true;

        assert.equal(expectedName, actualName, 'Unexpected Voter Name');
        assert.equal(expectedValidity, actualValidity, 'Unexpected Voter Validity');
    });

    it('Registration Phase - Register 1st Presidential Candidate and Get Candidate By Index 0', async () => {
        let contract = await VotingSystem.deployed();

        await contract.registerCandidate(web3.utils.asciiToHex('1st President Name'),
                                         web3.utils.asciiToHex('1st President Party List'),
                                         'Image Hash',
                                         'President');

        let actualCandidate = await contract.getCandidateByIndex(0, 'President');
        let actualName = web3.utils.hexToUtf8(actualCandidate[0]);
        let actualPartyList = web3.utils.hexToUtf8(actualCandidate[1]);
        let actualImgHash = actualCandidate[2];
        let actualVotes = actualCandidate[3];

        let expectedName = '1st President Name';
        let expectedPartyList = '1st President Party List';
        let expectedImgHash = 'Image Hash';
        let expectedVotes = 0;

        assert.equal(expectedName, actualName, 'Unexpected President Name');
        assert.equal(expectedPartyList, actualPartyList, 'Unexpected President Party List');
        assert.equal(expectedImgHash, actualImgHash, 'Unexpected President Image Hash');
        assert.equal(expectedVotes, actualVotes, 'Unexpected President Votes');
    });

    it('Registration Phase - Get Registered Presidential Candidate By Name', async () => {
        let contract = await VotingSystem.deployed();

        let actualCandidate = await contract.getCandidateByName(web3.utils.asciiToHex('1st President Name'), 'President');
        let actualName = web3.utils.hexToUtf8(actualCandidate[0]);
        let actualPartyList = web3.utils.hexToUtf8(actualCandidate[1]);
        let actualImgHash = actualCandidate[2];
        let actualVotes = actualCandidate[3];

        let expectedName = '1st President Name';
        let expectedPartyList = '1st President Party List';
        let expectedImgHash = 'Image Hash';
        let expectedVotes = 0;

        assert.equal(expectedName, actualName, 'Unexpected President Name');
        assert.equal(expectedPartyList, actualPartyList, 'Unexpected President Party List');
        assert.equal(expectedImgHash, actualImgHash, 'Unexpected President Image Hash');
        assert.equal(expectedVotes, actualVotes, 'Unexpected President Votes');
    });



    it('Registration Phase - Register 3 New Presidential Candidate and Get Last Presidential Candidate By Last Index', async () => {
        let contract = await VotingSystem.deployed();

        await contract.registerCandidate(web3.utils.asciiToHex('2nd President Name'),
                                         web3.utils.asciiToHex('2nd President Party List'),
                                         'Image Hash',
                                         'President');

        await contract.registerCandidate(web3.utils.asciiToHex('3rd President Name'),
                                         web3.utils.asciiToHex('3rd President Party List'),
                                         'Image Hash',
                                         'President');

        await contract.registerCandidate(web3.utils.asciiToHex('Last President Name'),
                                         web3.utils.asciiToHex('Last President Party List'),
                                         'Image Hash',
                                         'President');

        let presidentCount = await contract.getPresCount();

        let actualCandidate = await contract.getCandidateByIndex(presidentCount - 1, 'President');
        let actualName = web3.utils.hexToUtf8(actualCandidate[0]);
        let actualPartyList = web3.utils.hexToUtf8(actualCandidate[1]);
        let actualImgHash = actualCandidate[2];
        let actualVotes = actualCandidate[3];

        let expectedName = 'Last President Name';
        let expectedPartyList = 'Last President Party List';
        let expectedImgHash = 'Image Hash';
        let expectedVotes = 0;

        assert.equal(expectedName, actualName, 'Unexpected President Name');
        assert.equal(expectedPartyList, actualPartyList, 'Unexpected President Party List');
        assert.equal(expectedImgHash, actualImgHash, 'Unexpected President Image Hash');
        assert.equal(expectedVotes, actualVotes, 'Unexpected President Votes');
    });

    it('Registration Phase - Register 1st Vice Presidential Candidate and Get Candidate By Index 0', async () => {
        let contract = await VotingSystem.deployed();

        await contract.registerCandidate(web3.utils.asciiToHex('1st Vice President Name'),
                                         web3.utils.asciiToHex('1st Vice President Party List'),
                                         'Image Hash',
                                         'Vice President');

        let actualCandidate = await contract.getCandidateByIndex(0, 'Vice President');
        let actualName = web3.utils.hexToUtf8(actualCandidate[0]);
        let actualPartyList = web3.utils.hexToUtf8(actualCandidate[1]);
        let actualImgHash = actualCandidate[2];
        let actualVotes = actualCandidate[3];

        let expectedName = '1st Vice President Name';
        let expectedPartyList = '1st Vice President Party List';
        let expectedImgHash = 'Image Hash';
        let expectedVotes = 0;

        assert.equal(expectedName, actualName, 'Unexpected Vice President Name');
        assert.equal(expectedPartyList, actualPartyList, 'Unexpected Vice President Party List');
        assert.equal(expectedImgHash, actualImgHash, 'Unexpected Vice President Image Hash');
        assert.equal(expectedVotes, actualVotes, 'Unexpected Vice President Votes');
    });

    it('Registration Phase - Get Registered Vice Presidential Candidate By Name', async () => {
        let contract = await VotingSystem.deployed();

        let actualCandidate = await contract.getCandidateByName(web3.utils.asciiToHex('1st Vice President Name'), 'Vice President');
        let actualName = web3.utils.hexToUtf8(actualCandidate[0]);
        let actualPartyList = web3.utils.hexToUtf8(actualCandidate[1]);
        let actualImgHash = actualCandidate[2];
        let actualVotes = actualCandidate[3];

        let expectedName = '1st Vice President Name';
        let expectedPartyList = '1st Vice President Party List';
        let expectedImgHash = 'Image Hash';
        let expectedVotes = 0;

        assert.equal(expectedName, actualName, 'Unexpected President Name');
        assert.equal(expectedPartyList, actualPartyList, 'Unexpected President Party List');
        assert.equal(expectedImgHash, actualImgHash, 'Unexpected President Image Hash');
        assert.equal(expectedVotes, actualVotes, 'Unexpected President Votes');
    });

    it('Registration Phase - Register 3 New Vice Presidential Candidate and Get Last Vice Presidential Candidate By Last Index', async () => {
        let contract = await VotingSystem.deployed();

        await contract.registerCandidate(web3.utils.asciiToHex('2nd Vice President Name'),
                                         web3.utils.asciiToHex('2nd Vice President Party List'),
                                         'Image Hash',
                                         'Vice President');

        await contract.registerCandidate(web3.utils.asciiToHex('3rd Vice President Name'),
                                         web3.utils.asciiToHex('3rd Vice President Party List'),
                                         'Image Hash',
                                         'Vice President');

        await contract.registerCandidate(web3.utils.asciiToHex('Last Vice President Name'),
                                         web3.utils.asciiToHex('Last Vice President Party List'),
                                         'Image Hash',
                                         'Vice President');

        let vicePresidentCount = await contract.getVicePresCount();

        let actualCandidate = await contract.getCandidateByIndex(vicePresidentCount - 1, 'Vice President');
        let actualName = web3.utils.hexToUtf8(actualCandidate[0]);
        let actualPartyList = web3.utils.hexToUtf8(actualCandidate[1]);
        let actualImgHash = actualCandidate[2];
        let actualVotes = actualCandidate[3];

        let expectedName = 'Last Vice President Name';
        let expectedPartyList = 'Last Vice President Party List';
        let expectedImgHash = 'Image Hash';
        let expectedVotes = 0;

        assert.equal(expectedName, actualName, 'Unexpected Vice President Name');
        assert.equal(expectedPartyList, actualPartyList, 'Unexpected Vice President Party List');
        assert.equal(expectedImgHash, actualImgHash, 'Unexpected Vice President Image Hash');
        assert.equal(expectedVotes, actualVotes, 'Unexpected Vice President Votes');
    });

    it('Registration Phase - Register 1st Senatorial Candidate and Get Candidate By Index 0', async () => {
        let contract = await VotingSystem.deployed();

        await contract.registerCandidate(web3.utils.asciiToHex('1st Senator Name'),
                                         web3.utils.asciiToHex('1st Senator Party List'),
                                         'Image Hash',
                                         'Senator');

        let actualCandidate = await contract.getCandidateByIndex(0, 'Senator');
        let actualName = web3.utils.hexToUtf8(actualCandidate[0]);

        let actualPartyList = web3.utils.hexToUtf8(actualCandidate[1]);
        let actualImgHash = actualCandidate[2];
        let actualVotes = actualCandidate[3];

        let expectedName = '1st Senator Name';
        let expectedPartyList = '1st Senator Party List';
        let expectedImgHash = 'Image Hash';
        let expectedVotes = 0;

        assert.equal(expectedName, actualName, 'Unexpected Senator Name');
        assert.equal(expectedPartyList, actualPartyList, 'Unexpected Senator Party List');
        assert.equal(expectedImgHash, actualImgHash, 'Unexpected Senator Image Hash');
        assert.equal(expectedVotes, actualVotes, 'Unexpected Senator Votes');
    });

    it('Registration Phase - Get Registered Senatorial Candidate By Name', async () => {
        let contract = await VotingSystem.deployed();

        let actualCandidate = await contract.getCandidateByName(web3.utils.asciiToHex('1st Senator Name'), 'Senator');
        let actualName = web3.utils.hexToUtf8(actualCandidate[0]);
        let actualPartyList = web3.utils.hexToUtf8(actualCandidate[1]);
        let actualImgHash = actualCandidate[2];
        let actualVotes = actualCandidate[3];

        let expectedName = '1st Senator Name';
        let expectedPartyList = '1st Senator Party List';
        let expectedImgHash = 'Image Hash';
        let expectedVotes = 0;

        assert.equal(expectedName, actualName, 'Unexpected President Name');
        assert.equal(expectedPartyList, actualPartyList, 'Unexpected President Party List');
        assert.equal(expectedImgHash, actualImgHash, 'Unexpected President Image Hash');
        assert.equal(expectedVotes, actualVotes, 'Unexpected President Votes');
    });



    it('Registration Phase - Register 3 New Senatorial Candidate and Get Last Senatorial Candidate By Last Index', async () => {
        let contract = await VotingSystem.deployed();

        await contract.registerCandidate(web3.utils.asciiToHex('2nd Senator Name'),
                                         web3.utils.asciiToHex('2nd Senator Party List'),
                                         'Image Hash',
                                         'Senator');

        await contract.registerCandidate(web3.utils.asciiToHex('3rd Senator Name'),
                                         web3.utils.asciiToHex('3rd Senator Party List'),
                                         'Image Hash',
                                         'Senator');

        await contract.registerCandidate(web3.utils.asciiToHex('Last Senator Name'),
                                         web3.utils.asciiToHex('Last Senator Party List'),
                                         'Image Hash',
                                         'Senator');

        let senCount = await contract.getSenCount();

        let actualCandidate = await contract.getCandidateByIndex(senCount - 1, 'Senator');
        let actualName = web3.utils.hexToUtf8(actualCandidate[0]);
        let actualPartyList = web3.utils.hexToUtf8(actualCandidate[1]);
        let actualImgHash = actualCandidate[2];
        let actualVotes = actualCandidate[3];

        let expectedName = 'Last Senator Name';
        let expectedPartyList = 'Last Senator Party List';
        let expectedImgHash = 'Image Hash';
        let expectedVotes = 0;

        assert.equal(expectedName, actualName, 'Unexpected Senator Name');
        assert.equal(expectedPartyList, actualPartyList, 'Unexpected Senator Party List');
        assert.equal(expectedImgHash, actualImgHash, 'Unexpected Senator Image Hash');
        assert.equal(expectedVotes, actualVotes, 'Unexpected Senator Votes');
    });

    it('Registration Phase - Register Existing Presidential Candidate and Expect VM Error', async () => {
        let contract = await VotingSystem.deployed();

        // Use current version of Ganache (v2.1.6) doesn't return revert reason. Use v2.2.0 or newer.
        // await expectRevert(contract.registerVoter(web3.utils.asciiToHex('Expected 1st Voter Name')),"You are already registered as a voter.");

        // Workaround
        try {
            await contract.registerCandidate(web3.utils.asciiToHex('1st President Name'),
                                         web3.utils.asciiToHex('1st President Party List'),
                                         'Image Hash',
                                         'President');
            assert.fail();
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are already registered as a Presidential Candidate.');
        }

        try {
            await contract.registerCandidate(web3.utils.asciiToHex('1st President Name'),
                                         web3.utils.asciiToHex('1st President Party List'),
                                         'Image Hash',
                                         'Vice President');
            assert.fail();
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are already registered as a Presidential Candidate.');
        }

        try {
            await contract.registerCandidate(web3.utils.asciiToHex('1st President Name'),
                                         web3.utils.asciiToHex('1st President Party List'),
                                         'Image Hash',
                                         'Senator');
            assert.fail();
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are already registered as a Presidential Candidate.');
        }
    });

    it('Registration Phase - Register Existing Vice Presidential Candidate and Expect VM Error', async () => {
        let contract = await VotingSystem.deployed();

        // Use current version of Ganache (v2.1.6) doesn't return revert reason. Use v2.2.0 or newer.
        // await expectRevert(contract.registerVoter(web3.utils.asciiToHex('Expected 1st Voter Name')),"You are already registered as a voter.");

        // Workaround
        try {
            await contract.registerCandidate(web3.utils.asciiToHex('1st Vice President Name'),
                                         web3.utils.asciiToHex('1st Vice President Party List'),
                                         'Image Hash',
                                         'President');
            assert.fail();
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are already registered as a Vice Presidential Candidate.');
        }

        try {
            await contract.registerCandidate(web3.utils.asciiToHex('1st Vice President Name'),
                                         web3.utils.asciiToHex('1st Vice President Party List'),
                                         'Image Hash',
                                         'Vice President');
            assert.fail();
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are already registered as a Vice Presidential Candidate.');
        }

        try {
            await contract.registerCandidate(web3.utils.asciiToHex('1st Vice President Name'),
                                         web3.utils.asciiToHex('1st Vice President Party List'),
                                         'Image Hash',
                                         'Senator');
            assert.fail();
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are already registered as a Vice Presidential Candidate.');
        }

    });

    it('Registration Phase - Register Existing Senatorial Candidate and Expect VM Error', async () => {
        let contract = await VotingSystem.deployed();

        // Use current version of Ganache (v2.1.6) doesn't return revert reason. Use v2.2.0 or newer.
        // await expectRevert(contract.registerVoter(web3.utils.asciiToHex('Expected 1st Voter Name')),"You are already registered as a voter.");

        // Workaround
        try {
            await contract.registerCandidate(web3.utils.asciiToHex('1st Senator Name'),
                                         web3.utils.asciiToHex('1st Senator Party List'),
                                         'Image Hash',
                                         'President');
            assert.fail();
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are already registered as a Senatorial Candidate.');
        }

        try {
            await contract.registerCandidate(web3.utils.asciiToHex('1st Senator Name'),
                                         web3.utils.asciiToHex('1st Senator Party List'),
                                         'Image Hash',
                                         'Vice President');
            assert.fail();
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are already registered as a Senatorial Candidate.');
        }

        try {
            await contract.registerCandidate(web3.utils.asciiToHex('1st Senator Name'),
                                         web3.utils.asciiToHex('1st Senator Party List'),
                                         'Image Hash',
                                         'Senator');
            assert.fail();
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are already registered as a Senatorial Candidate.');
        }

    });

    it('Registration Phase - Register Candidate with Invalid Candidacy should expect VM Error', async () => {
        let contract = await VotingSystem.deployed();

        try {
            await contract.registerCandidate(web3.utils.asciiToHex('Candidate Name'),
                                             web3.utils.asciiToHex('Candidate Party List'),
                                             'Image Hash',
                                             'Invalid Candicacy');
            assert.fail();
        }
        catch(err) {
            assert.equal(err.message.slice(83, err.message.length),
                         'Invalid Candidacy Input.');
        }
    });

    it('Post Registration Phase - Register Candidates and Voters Should Expect VM Error', async () => {
        await time.increase(time.duration.days(1));

        let contract = await VotingSystem.deployed();

        try {
            await contract.registerVoter(web3.utils.asciiToHex('Late Voter Name'));
        }
        catch(err) {
            assert.equal(err.message.slice(83, err.message.length),
                         'Registration Prohibited.');
        }

        try {
            await contract.registerCandidate(web3.utils.asciiToHex('Late Candidate Name'),
                                             web3.utils.asciiToHex('Late Candidate Party List'),
                                         'Image Hash',
                                         'President');
        }
        catch(err) {
            assert.equal(err.message.slice(83, err.message.length),
                         'Registration Prohibited.');
        }

        try {
            await contract.voteCandidate(web3.utils.asciiToHex('1st President Name'),
                                     'President',
                                     web3.utils.asciiToHex('Late Voter Name'));
        }
        catch(err) {
            assert.equal(err.message.slice(83, err.message.length),
                         'Voting Prohibited.');
        }
    });

    it('Pre Voting Phase - Voting should expect VM Error', async () => {
        let contract = await VotingSystem.deployed();

        try {
            await contract.voteCandidate(web3.utils.asciiToHex('Early President Name'),
                                         'President',
                                         web3.utils.asciiToHex('Early Voter Name'));
            assert.fail();
        }
        catch(err) {
            assert.equal(err.message.slice(83, err.message.length),
                         'Voting Prohibited.');
        }
    });

    it('Voting Phase - Voting for an Invalid Candidacy should expect VM Exception', async () => {
        await time.increase(time.duration.days(1));
        let contract = await VotingSystem.deployed();

        try {
            await contract.voteCandidate(web3.utils.asciiToHex('1st President Name'),
                                     'Invalid Candidacy',
                                      web3.utils.asciiToHex('1st Voter Name'));
            assert.fail();
        }
        catch(err) {
            assert.equal(err.message.slice(83, err.message.length),
                         'Invalid Candidacy Input.');
        }
    });

    it('Voting Phase - 1st Voter will vote for the 1st Candidates registered respectively', async () =>{
        let contract = await VotingSystem.deployed();

        await contract.voteCandidate(web3.utils.asciiToHex('1st President Name'),
                                     'President',
                                     web3.utils.asciiToHex('1st Voter Name'));

        await contract.voteCandidate(web3.utils.asciiToHex('1st Vice President Name'),
                                     'Vice President',
                                     web3.utils.asciiToHex('1st Voter Name'));

        await contract.voteCandidate(web3.utils.asciiToHex('1st Senator Name'),
                                     'Senator',
                                     web3.utils.asciiToHex('1st Voter Name'));

        await contract.invalidateVoter(web3.utils.asciiToHex('1st Voter Name'));

        let actualPresVotes = await contract.getVotes(web3.utils.asciiToHex('1st President Name'), 'President');
        let actualVicePresVotes = await contract.getVotes(web3.utils.asciiToHex('1st Vice President Name'), 'Vice President');
        let actualSenVotes = await contract.getVotes(web3.utils.asciiToHex('1st Senator Name'), 'Senator');

        let expectedPresVotes = 1;
        let expectedVicePresVotes = 1;
        let expectedSenVotes = 1;

        assert.equal(actualPresVotes, expectedPresVotes);
        assert.equal(actualVicePresVotes, expectedVicePresVotes);
        assert.equal(actualSenVotes, expectedSenVotes);
    });

    it('Voting Phase - Voting again should expect VM Exception', async () => {
        let contract = await VotingSystem.deployed();

        try {
            await contract.voteCandidate(web3.utils.asciiToHex('1st President Name'),
                                         'President',
                                         web3.utils.asciiToHex('1st Voter Name'));
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are not a Valid Voter.');
        }
    });

    it('Post Voting Phase - Voting should expect VM Error', async () => {
        let contract = await VotingSystem.deployed();
        await time.increase(time.duration.days(1));

        try {
            await contract.voteCandidate(web3.utils.asciiToHex('Late President Name'),
                                         'President',
                                         web3.utils.asciiToHex('Late Voter Name'));
            assert.fail();
        }
        catch(err) {
            assert.equal(err.message.slice(83, err.message.length),
                         'Voting Prohibited.');
        }
    });

    it('Function Parameters with Invalid Candidacy should expect VM Revert Error', async () => {
        let contract = await VotingSystem.deployed();

        // Solidity Public View Function does not seem to return the revert error msg
        try {
            await contract.getCandidateByIndex(0, 'Invalid Candidacy');
            assert.fail();
        }
        catch(err) {
            assert.equal(err.message, 'Returned error: VM Exception while processing transaction: revert');
        }

        try {
            await contract.getCandidateByName(web3.utils.asciiToHex('1st President Name'),
                                              'Invalid Candidacy');
            assert.fail();
        }
        catch(err) {
            assert.equal(err.message, 'Returned error: VM Exception while processing transaction: revert');
        }
    });

    it('Querying Unregistered Candidates and Voter should expect VM Revert Error', async () => {
        let contract = await VotingSystem.deployed();

        // Solidity Public View Function does not seem to return the revert error msg
        try {
            await contract.getCandidateByName(web3.utils.asciiToHex('Unregistered President'),
                                              'President');
            assert.fail();
        }
        catch(err) {
            assert.equal(err.message, 'Returned error: VM Exception while processing transaction: revert');
        }

        try {
            await contract.getVoterByName(web3.utils.asciiToHex('Unregistered Voter'));
            assert.fail();
        }
        catch(err) {
            assert.equal(err.message, 'Returned error: VM Exception while processing transaction: revert');
        }
    });
});
const VotingSystem = artifacts.require("VotingSystem");
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers');

contract("VotingSystemTest - Voters", accounts => {
    it('Register 1st Voter and Get Voter By Index 0', async () => {
        let contract = await VotingSystem.deployed();

        await contract.registerVoter(web3.utils.asciiToHex('Expected 1st Voter Name'));

        let actualVoter = await contract.getVoterByIndex(0);
        let actualVoterName = web3.utils.hexToUtf8(actualVoter[0]);
        let actualVoterValidity = actualVoter[1];

        let expectedVoterName = 'Expected 1st Voter Name';
        let expectedVoterValidity = true;

        assert.equal(expectedVoterName, actualVoterName, 'Unexpected Voter Name');
        assert.equal(expectedVoterValidity, actualVoterValidity, 'Unexpected Voter Validity');
    });

    it('Register Same Voter and Expect VM Error', async () => {
        let contract = await VotingSystem.deployed();

        // Use current version of Ganache (v2.1.6) doesn't return revert reason. Use v2.2.0 or newer.
        // await expectRevert(contract.registerVoter(web3.utils.asciiToHex('Expected 1st Voter Name')),"You are already registered as a voter.");

        // Workaround
        try {

            await contract.registerVoter(web3.utils.asciiToHex('Expected 1st Voter Name'));
        }
        catch(err)
        {
            assert.equal(err.message.slice(83, err.message.length),
                         'You are already registered as a voter.');
        }

    });

    it('Register 3 Voters and Get Last Voter By Last Index', async () => {
        let contract = await VotingSystem.deployed();

        await contract.registerVoter(web3.utils.asciiToHex('Expected Voter Name 1'));
        await contract.registerVoter(web3.utils.asciiToHex('Expected Voter Name 2'));
        await contract.registerVoter(web3.utils.asciiToHex('Expected Voter Name 3'));

        let voterCount = await contract.getVoterCount();

        let actualVoter = await contract.getVoterByIndex(voterCount - 1);
        let actualVoterName = web3.utils.hexToUtf8(actualVoter[0]);
        let actualVoterValidity = actualVoter[1];

        let expectedVoterName = 'Expected Voter Name 3';
        let expectedVoterValidity = true;

        assert.equal(expectedVoterName, actualVoterName, 'Unexpected Voter Name');
        assert.equal(expectedVoterValidity, actualVoterValidity, 'Unexpected Voter Validity');
    });

    it('Register 1st Voter and Get Voter By Name', async () => {
        let contract = await VotingSystem.deployed();

        await contract.registerVoter(web3.utils.asciiToHex('Expected Voter Name'));

        let actualVoter = await contract.getVoterByName(web3.utils.asciiToHex('Expected Voter Name'));
        let actualVoterName = web3.utils.hexToUtf8(actualVoter[0]);
        let actualVoterValidity = actualVoter[1];

        let expectedVoterName = 'Expected Voter Name';
        let expectedVoterValidity = true;

        assert.equal(expectedVoterName, actualVoterName, 'Unexpected Voter Name');
        assert.equal(expectedVoterValidity, actualVoterValidity, 'Unexpected Voter Validity');
    });
});

contract("VotingSystemTest - Presidential Candidates", accounts => {

})
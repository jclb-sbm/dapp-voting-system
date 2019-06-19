const VotingSystem = artifacts.require("VotingSystem");

contract("VotingSystemTest", accounts => {

    it("should add 1 vote on candidate", async () => {

        const votingSystem = await VotingSystem.new();

        await votingSystem.registerCandidate("A", 'imgHash');
        await votingSystem.registerVoter("B");
        await votingSystem.voteCandidate("A", "B");

        assert.equal(await votingSystem.getVotes("A"), 1, "Tally of votes is wrong.");
    });

});
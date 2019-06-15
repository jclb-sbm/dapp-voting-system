pragma solidity 0.5.8;

import "truffle/Assert.sol";
import "../contracts/VotingSystem.sol";

contract VotingSystemTest {

    function testcase_validCandidate_validVoter() public {
        VotingSystem votingSystem = new VotingSystem();

        votingSystem.registerCandidate("A");
        votingSystem.registerVoter("B");
        votingSystem.voteCandidate("A", "B");

        Assert.equal(votingSystem.getVotes("A"), 1, "Tally of votes is wrong.");
    }

    // function testcase_validCandidate_invalidVoter() public {
    //     VotingSystem votingSystem = new VotingSystem();

    //     votingSystem.registerCandidate("A");
    //     votingSystem.registerVoter("C");
    //     votingSystem.voteCandidate("A", "B");

    //     Assert.equal(votingSystem.getVotes("A"), 0, "Tally of votes is wrong.");
    // }
}
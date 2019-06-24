const VotingSystem = artifacts.require("VotingSystem");

module.exports = function(deployer) {
    deployer.deploy(VotingSystem, 0, 5, 0, 5);
};
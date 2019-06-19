<template>
    <div>
        <h1>Voters</h1>

        <form>
            <input type="text" v-model="voterName"/>
            <button @click.prevent="registerVoter">
                Register Voter
            </button>

            <input type="text" v-model="candidateName"/>
            <button @click.prevent="voteCandidate">
                Vote Candidate
            </button>

            <button @click.prevent="getCandidates" >
                Get Candidate List
            </button>
        </form>

    </div>
</template>

<script>
    const Web3 = require('web3');
    const web3 = new Web3('ws://localhost:8545', null, {});

    export default {
        data() {
            return {
                voterName: null,
                candidateName: null,
                contract: null,
                defaultAccount: null,
            }
        },
        mounted: async function() {
            const VotingSystem = require('./../../build/contracts/VotingSystem.json');

            const contractABI = VotingSystem.abi;
            const contractAddress = VotingSystem.networks[5777].address;

            let accounts = await web3.eth.getAccounts();
            this.defaultAccount = accounts[0];

            this.contract = new web3.eth.Contract(contractABI, contractAddress);
        },
        methods: {
            registerVoter: async function () {
                await this.contract.methods.registerVoter(this.voterName).send({from: this.defaultAccount});
            },
            voteCandidate: async function () {
                await this.contract.methods.voteCandidate(this.candidateName, this.voterName).send({from: this.defaultAccount});
            },
            getCandidates: async function () {
                let candidateCount = await this.contract.methods.getCandidateCount().call();
                console.log(candidateCount.toString());
                for (let i=0; i < candidateCount; i++) {
                    let candidate = await this.contract.methods.getCandidateByIndex(i).call();
                    console.log(candidate);
                }
            }
        }
    }
</script>


<style scoped>

</style>
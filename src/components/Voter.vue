<template>
    <div class="cotainer-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card-deck">
                    <div v-for="candidate in candidateList" :key="candidate[0]">
                        <div class="card" style="width: 18rem;">
                            <img class="card-img-top" :src="candidate.imgHash" alt="Card image cap">
                            <div class="card-body">
                                <h5 class="card-title">{{ candidate.name }}</h5>
                                <a href="#" class="btn btn-primary">Vote</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

        <!-- <button @click.prevent="logoutVoter">
            Log Out
        </button> -->
</template>

<script>
    const Web3 = require('web3');
    const web3 = new Web3('ws://localhost:8545', null, {});

    export default {
        data() {
            return {
                showDismissibleAlert: false,
                invalidLoginReason: null,

                voterLoggedIn: false,
                voterName: null,
                voter: null,
                candidateName: null,
                contract: null,
                defaultAccount: null,
                candidateList: [],
            }
        },
        mounted: async function () {
            const VotingSystem = require('./../../build/contracts/VotingSystem.json');

            const contractABI = VotingSystem.abi;
            const contractAddress = VotingSystem.networks[5777].address;

            let accounts = await web3.eth.getAccounts();
            this.defaultAccount = accounts[0];

            this.contract = new web3.eth.Contract(contractABI, contractAddress);

            this.loadCandidates();
        },
        methods: {
            voteCandidate: async function () {
                await this.contract.methods.voteCandidate(this.candidateName, this.voterName).send({
                    from: this.defaultAccount
                });
            },
            loadCandidates: async function () {
                let candidateCount = await this.contract.methods.getCandidateCount().call();

                this.candidateList = [];
                for (let i = 0; i < candidateCount; i++) {

                    let candidateTuple = await this.contract.methods.getCandidateByIndex(i).call();
                    let candidate = {
                        name: candidateTuple[0],
                        imgHash: `http://127.0.0.1:8080/ipfs/${candidateTuple[1]}`,
                        votes: candidateTuple[2]
                    }
                    this.candidateList.push(candidate);

                }
            },
            logoutVoter: function () {
                this.voter = null;
            },
        }
    }
</script>

<style scoped>

</style>
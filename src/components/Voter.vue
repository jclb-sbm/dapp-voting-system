<template>
        <div id='mainContainer' class="container-fluid">
            <div class="row">
                <div class="col-6 offset-4">
                    <div class="card-deck">
                        <div v-for="candidate in presCandidates" :key="candidate[0]">
                            <div class="card" style="width: 18rem;">
                                <img class="card-img-top" :src="candidate.imgHash" alt="Card image cap">
                                <div class="card-body">
                                    <h5 class="card-title">{{ candidate.name }}</h5>
                                    <!-- <div class="card-text">
                                        Votes: {{ candidate.votes }}
                                    </div> -->
                                    <div class="custom-control custom-radio">
                                        <input type="radio" :name="candidate.name" :value="candidate.name" v-model="chosenPres" class="custom-control-input"
                                        :id="candidate.name">
                                        <label class="custom-control-label" :for="candidate.name">Vote as President</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card-deck">
                        <div v-for="candidate in senCandidates" :key="candidate[0]">
                            <div class="card" style="width: 15rem;">
                                <img class="card-img-top" :src="candidate.imgHash" alt="Card image cap">
                                <div class="card-body">
                                    <h5 class="card-title">{{ candidate.name }}</h5>
                                    <!-- <div class="card-text">
                                        Votes: {{ candidate.votes }}
                                    </div> -->

                                    <div class="custom-control custom-checkbox">
                                        <input class="custom-control-input" type="checkbox" :id="candidate.name" :value="candidate.name" v-model="chosenSenators"/>
                                        <label class="custom-control-label" :for="candidate.name ">
                                            Vote as Senator
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-1 offset-5">
                    <button class="btn btn-light" @click="finishVoting">
                        Finish Voting
                    </button>
                </div>
            </div>



        <!-- <button @click.prevent="logoutVoter">
            Log Out
        </button> -->
        </div>
</template>

<script>
import { timingSafeEqual } from 'crypto';
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

                presCandidates: [],
                senCandidates: [{name: 'SenA', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'SenB', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'SenC', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'SenD', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'SenE', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'SenG', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'SenH', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'SenI', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'SenJ', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'SenK', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'SenL', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'SenM', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0}],

                chosenPres: null,
                chosenSenators: [],
            }
        },
        mounted: async function () {
            const VotingSystem = require('./../../build/contracts/VotingSystem.json');

            const contractABI = VotingSystem.abi;
            const contractAddress = VotingSystem.networks[5777].address;

            let accounts = await web3.eth.getAccounts();
            this.defaultAccount = accounts[0];

            this.contract = new web3.eth.Contract(contractABI, contractAddress);
            this.voterName = this.$route.params.id;

            this.loadPresidents();
        },
        methods: {
            voteCandidate: async function (candidateName, candidacy) {
                await this.contract
                          .methods
                          .voteCandidate(web3.utils.asciiToHex(candidateName), candidacy, web3.utils.asciiToHex(this.voterName)).send({
                    from: this.defaultAccount
                });
            },
            loadPresidents: async function () {
                let presCount = await this.contract.methods.getPresCount().call();

                this.presCandidates = [];
                for (let i = 0; i < presCount; i++) {

                    let candidateTuple = await this.contract.methods.getCandidateByIndex(i, 'President').call();
                    let candidate = {
                        name: web3.utils.hexToUtf8(candidateTuple[0]),
                        imgHash: `http://127.0.0.1:8080/ipfs/${candidateTuple[1]}`,
                        votes: candidateTuple[2]
                    }
                    this.presCandidates.push(candidate);
                    console.log(this.presCandidates);

                }
            },
            finishVoting: async function () {
                this.voteCandidate(this.chosenPres, 'President');

                for (let i=0; i<this.chosenSenators.length; i++) {
                    this.voteCandidate(this.chosenSenators[i], 'President');
                }
            },
            logoutVoter: function () {
                this.voter = null;
            },
        }
    }
</script>

<style scoped>
    #mainContainer {
        background: #000000de;
    }
</style>
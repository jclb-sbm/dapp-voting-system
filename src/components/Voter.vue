<template>
        <div id='mainContainer' class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <h1 class="display-4 text-white">Presidents</h1>
                    <div class="card-deck d-flex justify-content-center">
                        <div v-for="candidate in presCandidates" :key="candidate[0]">
                            <div class="card border-light text-white bg-transparent mb-3" style="width: 18rem;">
                                <img class="card-img-top" :src="candidate.imgHash" alt="Card image cap">
                                <div class="card-body">

                                    <h5 class="card-title">{{ candidate.name }}</h5>

                                    <div class="card-text">
                                        Party List
                                    </div>
                                </div>
                                <div class="card-footer">
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
                    <h1 class="display-4 text-white">Vice Presidents</h1>
                    <div class="card-deck d-flex justify-content-center">
                        <div v-for="candidate in vicePresCandidates" :key="candidate[0]">
                            <div class="card border-light text-white bg-transparent mb-3" style="width: 18rem;">
                                <img class="card-img-top" :src="candidate.imgHash" alt="Card image cap">
                                <div class="card-body">

                                    <h5 class="card-title">{{ candidate.name }}</h5>

                                    <div class="card-text">
                                        Party List
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" :name="candidate.name" :value="candidate.name" v-model="chosenPres" class="custom-control-input"
                                        :id="candidate.name">
                                        <label class="custom-control-label" :for="candidate.name">Vote as Vice President</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <h1 class="display-4 text-white">Senators</h1>
                    <div class="card-deck d-flex justify-content-center">
                        <div v-for="candidate in senCandidates" :key="candidate[0]">

                            <div class="card border-light text-white bg-transparent mb-3" style="width: 15rem;">

                                <!-- <div class="card-header">
                                    <h4>{{ candidate.name }}</h4>
                                </div> -->

                                <img class="card-img-top" :src="candidate.imgHash" alt="Card image cap">
                                <div class="card-body">
                                    <!-- <h5 class="card-title">Party list</h5> -->
                                    <h4 class="card-title">{{ candidate.name }}</h4>
                                    <div class="card-text">
                                        Party List
                                    </div>


                                </div>

                                <div class="card-footer">
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
                <div class="col-4 offset-4 d-flex justify-content-center">
                    <button id="votingButton" class="btn btn-lg btn-outline-light btn-block" @click="finishVoting">
                        Finish Voting
                    </button>
                </div>
            </div>

        </div>
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

                presCandidates: [{name: 'President A', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                 {name: 'President B', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0}],

                vicePresCandidates: [{name: 'Vice President A', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                     {name: 'Vice President B', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0}],

                senCandidates: [{name: 'Senator A', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator B', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator C', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator D', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator E', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator F', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator G', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator H', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator I', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator J', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator K', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator L', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator M', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator N', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator O', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator P', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator Q', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator R', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator S', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator T', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator U', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator W', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator X', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator Y', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0},
                                {name: 'Senator Z', imgHash: 'https://ipfs.io/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 0}],

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

            // this.loadPresidents();
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
        padding: 25px;
    }

    #votingButton {
        margin-top: 30px;
        margin-bottom: 20px;
    }

    .card {
        margin-top: 20px;
        margin-bottom: 10px;
    }
</style>
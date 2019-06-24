<template>
    <div id='mainContainer' class="container-fluid">
        <div id='particles-js'>
        </div>
        <div id='main'>
            <div class="row">
                <div class="col-12">
                    <h1 class="display-4 text-white">Presidents</h1>
                    <div class="card-deck d-flex justify-content-left">
                        <div v-for="candidate in presCandidates" :key="candidate[0]">
                            <div class="card border-light text-white bg-transparent mb-3" style="width: 18rem;">
                                <img class="card-img-top" :src="candidate.imgHash" alt="Card image cap">

                                <div class="card-body">
                                    <h5 class="card-title">{{ candidate.name }}</h5>
                                    <div class="card-text">
                                        <i>{{ candidate.partyList }}</i>
                                    </div>
                                </div>

                                <div class="card-footer">
                                    <h2>{{ candidate.votes }}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <h1 class="display-4 text-white">Vice Presidents</h1>
                    <div class="card-deck d-flex justify-content-left">
                        <div v-for="candidate in vicePresCandidates" :key="candidate[0]">
                            <div class="card border-light text-white bg-transparent mb-3" style="width: 18rem;">
                                <img class="card-img-top" :src="candidate.imgHash" alt="Card image cap">
                                <div class="card-body">

                                    <h5 class="card-title">{{ candidate.name }}</h5>

                                    <div class="card-text">
                                        <i>{{ candidate.partyList }}</i>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <h2>{{ candidate.votes }}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <h1 class="display-4 text-white">Senators</h1>
                    <div class="card-deck d-flex justify-content-left">
                        <div v-for="candidate in senCandidates" :key="candidate[0]">

                            <div class="card border-light text-white bg-transparent mb-3" style="width: 15rem;">
                                <img class="card-img-top" :src="candidate.imgHash" alt="Card image cap">
                                <div class="card-body">
                                    <h2 class="card-title">{{ candidate.name }}</h2>
                                    <div class="card-text">
                                        <i>{{ candidate.partyList }}</i>
                                    </div>


                                </div>

                                <div class="card-footer">
                                    <h2>{{ candidate.votes }}</h2>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    require('particles.js')
    import ParticleSettings from './../assets/particles.json';

    const Web3 = require('web3');
    const web3 = new Web3('ws://localhost:8545', null, {});

    export default {
        data() {
            return {
                defaultAccount: null,
                contract: null,

                presCandidates: [],
                vicePresCandidates: [],
                senCandidates: [],
            }
        },
        created() {
            this.$nextTick(() => {
                this.initParticlesJS()
            })
        },
        mounted: async function () {
            const VotingSystem = require('./../../build/contracts/VotingSystem.json');

            const contractABI = VotingSystem.abi;
            const contractAddress = VotingSystem.networks[5777].address;

            let accounts = await web3.eth.getAccounts();
            this.defaultAccount = accounts[1];

            this.contract = new web3.eth.Contract(contractABI, contractAddress);

            this.loadCandidates();
        },
        methods: {
            initParticlesJS() {
                particlesJS('particles-js', ParticleSettings);
            },
            loadCandidates: async function () {
                let presCount = await this.contract.methods.getPresCount().call();
                let vicePresCount = await this.contract.methods.getVicePresCount().call();
                let senCount = await this.contract.methods.getSenCount().call();

                this.presCandidates = [];
                this.vicePresCandidates = [];
                this.senCandidates = [];


                for (let i = 0; i < presCount; i++) {
                    let candidateTuple = await this.contract.methods.getCandidateByIndex(i, 'President').call();
                    let candidate = {
                        name: web3.utils.hexToUtf8(candidateTuple[0]),
                        partyList: web3.utils.hexToUtf8(candidateTuple[1]),
                        imgHash: `http://127.0.0.1:8080/ipfs/${candidateTuple[2]}`,
                        votes: candidateTuple[3]
                    }
                    this.presCandidates.push(candidate);
                }

                for (let i = 0; i < vicePresCount; i++) {
                    let candidateTuple = await this.contract.methods.getCandidateByIndex(i, 'Vice President').call();
                    let candidate = {
                        name: web3.utils.hexToUtf8(candidateTuple[0]),
                        partyList: web3.utils.hexToUtf8(candidateTuple[1]),
                        imgHash: `http://127.0.0.1:8080/ipfs/${candidateTuple[2]}`,
                        votes: candidateTuple[3]
                    }
                    this.vicePresCandidates.push(candidate);
                }

                for (let i = 0; i < senCount; i++) {
                    let candidateTuple = await this.contract.methods.getCandidateByIndex(i, 'Senator').call();
                    let candidate = {
                        name: web3.utils.hexToUtf8(candidateTuple[0]),
                        partyList: web3.utils.hexToUtf8(candidateTuple[1]),
                        imgHash: `http://127.0.0.1:8080/ipfs/${candidateTuple[2]}`,
                        votes: candidateTuple[3]
                    }
                    this.senCandidates.push(candidate);
                    console.log(candidate)
                }
                this.presCandidates.sort((a, b) => a.votes < b.votes);
                this.vicePresCandidates.sort((a, b) => a.votes < b.votes);
                this.senCandidates.sort((a, b) => a.votes < b.votes);
            },
        }
    }
</script>

<style scoped>
    #particles-js {
        background: rgba(0, 0, 0, 0.90);
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0
    }

    #main {
        padding-top: 45px;
        padding-bottom: 45px;

        padding-left: 2vw;
        padding-right: 2vw;
    }

    #mainContainer {
        height: 100vh;
    }

    canvas {
        display:block;
        position: fixed;
    }
</style>
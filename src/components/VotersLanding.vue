<template>
    <div id="mainContainer">

        <div v-if="voterLoggedIn">
            <form>
                <input type="text" v-model="candidateName" />
                <button @click.prevent="voteCandidate">
                    Vote Candidate
                </button>
            </form>

            <div v-for="candidate in candidateList" :key="candidate[0]">
                <b-card :title="candidate.name" :img-src="candidate.imgHash" img-alt="Image" img-top tag="article"
                    class="mb-2">
                    <b-card-text>
                        Votes: {{ candidate.votes }}
                    </b-card-text>
                </b-card>
            </div>
        </div>
        <div v-else>
            <div id='particles-js'>
            </div>
            <div class="center">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-12">
                            <form>
                                <div class="form-group">
                                    <input type="email" class="form-control form-control-lg transparent-input"
                                        id="voterLoginInput" placeholder="Enter Voter Name Here">
                                </div>
                                <div class="row">
                                    <div class="col-4 offset-4">
                                        <button type="submit" class="btn btn-outline-light btn-block">Proceed</button>
                                    </div>
                                </div>
                            </form>
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
                voterLoggedIn: false,
                voterName: null,
                candidateName: null,
                contract: null,
                defaultAccount: null,
                candidateList: [],
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
            this.defaultAccount = accounts[0];

            this.contract = new web3.eth.Contract(contractABI, contractAddress);

            this.loadCandidates();
        },
        methods: {
            initParticlesJS() {
                particlesJS('particles-js', ParticleSettings);
            },
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
            }
        }
    }
</script>


<style scoped>
    #particles-js {
        background: #000000de;
    }


    #voterLoginInput {
        height: 6vh;
        color: white
    }

    #login {
        background: black;
    }

    input.transparent-input {
        background-color: transparent !important;
    }

    .form-control:focus {
        border-color: #FFFFFF;
        box-shadow: inset 0 .5px .5px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 255, 255);
    }

    .center {
        position: absolute;
        top: 50%;
        left: 50%;
        -moz-transform: translateX(-50%) translateY(-50%);
        -webkit-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
        width: 35vw;
        height: 20vh;
    }
</style>
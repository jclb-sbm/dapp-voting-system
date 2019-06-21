<template>
    <div id="mainContainer">

        <div id='particles-js'>
        </div>

        <div class="center">
            <div class="container-fluid">

                <b-alert v-model="showDismissibleAlert" variant="dark" dismissible>
                    Invalid Voter Log-in: {{ invalidLoginReason }}
                </b-alert>

                <div class="row">
                    <div class="col-sm-12">
                        <form>
                            <div class="form-group">
                                <input type="text" class="form-control form-control-lg transparent-input"
                                    v-model="voterName" id="voterLoginInput" placeholder="Enter Voter Name Here">
                            </div>
                            <div class="row">
                                <div class="col-4 offset-4">
                                    <button @click.prevent="loginVoter"
                                        class="btn btn-outline-light btn-block">Proceed</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    require('particles.js')
    import ParticleSettings from './../assets/particles.json';
    import router from './../router.js';

    const Web3 = require('web3');
    const web3 = new Web3('ws://localhost:8545', null, {});

    export default {
        data() {
            return {
                showDismissibleAlert: false,
                invalidLoginReason: null,

                voterName: null,
                voter: null,
                contract: null,
                defaultAccount: null,
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

        },
        methods: {
            initParticlesJS() {
                particlesJS('particles-js', ParticleSettings);
            },
            loginVoter: async function () {
                let voterTuple = await this.contract
                                           .methods
                                           .getVoterByName(web3.utils.asciiToHex(this.voterName))
                                           .call();

                if (voterTuple === null) {
                    this.showDismissibleAlert = true;
                    this.invalidLoginReason = "No Retrieved Data."
                    return;
                }

                this.voter = {
                    name: voterTuple[0],
                    valid: voterTuple[1]
                }

                if (this.voter.name === "") {
                    this.showDismissibleAlert = true;
                    this.invalidLoginReason = "You are not a registered Voter"
                    return;
                }

                if (this.voter.valid === false) {
                    this.showDismissibleAlert = true;
                    this.invalidLoginReason = "You are no longer a Valid Voter"
                    return;
                }

                this.gIsVoterLoggedIn = true;
                router.push({ name: 'voter', params: { id: web3.utils.hexToUtf8(this.voter.name), valid: this.voter.valid }});
            },
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
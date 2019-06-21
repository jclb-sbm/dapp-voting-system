<template>
    <div id="mainContainer">
        <div id="buttonsContainer" class="container-fluid">
            <div class="row">
                <div class="col-12 d-flex justify-content-center">
                    <h1 class="display-2 text-white">Admin Page</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-3 offset-3">
                    <button class="btn btn-lg btn-outline-light btn-block mt-4">
                        Setup Election
                    </button>
                </div>
                <div class="col-3">
                    <button class="btn btn-lg btn-outline-light btn-block mt-4">
                        Publish Results
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="col-3 offset-3">
                    <button class="btn btn-lg btn-outline-light btn-block mt-4" v-b-modal.regCandidateModal>
                        Register Candidate
                    </button>
                </div>
                <div class="col-3">
                    <button class="btn btn-lg btn-outline-light btn-block mt-4" v-b-modal.regVoterModal>
                        Register Voter
                    </button>
                </div>
            </div>
        </div>

        <b-modal id="regCandidateModal" header-border-variant="secondary" footer-border-variant="secondary"
                                        header-bg-variant="main" header-text-variant="light"
                                        body-bg-variant="main" body-text-variant="light"
                                        footer-bg-variant="main" footer-text-variant="light">
            <div class="container-fluid modal-container" >
                <div class="row">
                    <div class="col-12">
                        <form>
                            <div class="form-group">
                                <label for="candidateName">Candidate Name:</label>
                                <input id="candidateName" v-model="candidate.name" type="text" class="form-control bg-transparent text-white" placeholder="Enter Candidate Name">
                            </div>

                            <div class="form-group">
                                <label for="candidatePartyList">Party List:</label>
                                <input id="candidatePartyList" v-model="candidate.partyList" type="text" class="form-control bg-transparent text-white" placeholder="Enter Party List">
                            </div>

                            <div class="form-group">
                                <label for="candidacy">Running for:</label>
                                <select id="candidacy" v-model="candidate.candidacy" class="custom-select bg-transparent text-white">
                                    <option value="" disabled>Choose Candidacy</option>
                                    <option value="President">President</option>
                                    <option value="Vice President">Vice President</option>
                                    <option value="Senator">Senator</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="candidatePicture">Candidate Picture</label>

                                <div class="custom-file">
                                    <input id="candidatePicture" type="file" class="custom-file-input" accept="image/*" @change="captureFile">
                                    <label for="candidatePicture" class="custom-file-label">{{ fileName }}</label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="w-100 d-flex justify-content-center">
                <button class="btn btn-light" @click.prevent="registerCandidate">
                    Register Candidate
                </button>
            </div>
        </b-modal>

        <b-modal id="regVoterModal" header-border-variant="secondary" footer-border-variant="secondary"
                                    header-bg-variant="main" header-text-variant="light"
                                    body-bg-variant="main" body-text-variant="light"
                                    footer-bg-variant="main" footer-text-variant="light">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <form>
                            <div class="form-group">
                                <label for="voterName">Voter Name:</label>
                                <input id="voterName" type="text" class="form-control bg-transparent text-white" placeholder="Enter Voter Name">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="w-100 d-flex justify-content-center">
                <button class="btn btn-light">
                    Register Voter
                </button>
            </div>
        </b-modal>

    </div>
</template>

<script>
    const Web3 = require('web3');
    const IPFS = require('ipfs-http-client')

    const Buffer = IPFS.Buffer;
    const web3 = new Web3('ws://localhost:8545', null, {});
    const ipfs = new IPFS('/ip4/127.0.0.1/tcp/5001');

    export default {
        data() {
            return {
                candidate: {
                    name: null,
                    partyList: null,
                    candidacy: '',
                    imgHash: null,
                },

                voterName: null,

                contract: null,
                defaultAccount: null,

                fileName: 'Choose Picture',
                buffer: null,
            }
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
            registerCandidate: async function () {
                let hash = await ipfs.add(this.buffer);
                this.candidate.imgHash = hash[0].hash;

                await this.contract.methods
                        .registerCandidate(
                            web3.utils.asciiToHex(this.candidate.name),
                            this.candidate.imgHash,
                            this.candidate.candidacy)
                        .send({
                            from: this.defaultAccount,
                            gas: 1000000
                        })

            },
            registerVoter: async function () {
                await this.contract.methods
                        .registerVoter(web3.utils.asciiToHex(this.voterName))
                        .send({
                            from: this.defaultAccount,
                            gas: 1000000
                        });
            },

            getCandidate: async function () {
                let candidate = await this.contract.methods
                                    .getCandidateByName(web3.utils.asciiToHex('B'), "President")
                                    .call({from: this.defaultAccount});

                console.log(candidate);
                console.log(web3.utils.hexToUtf8(candidate[0]));
                console.log(candidate[1]);
                console.log(candidate[2].toString());
            },
            getVotes: async function () {
                let votes = await this.contract.methods.getVotes(web3.utils.asciiToHex(this.candidateName),
                    web3.utils.asciiToHex(this.candidateCandidacy)).call({
                    from: this.defaultAccount
                })
                console.log(votes.toString())
            },
            async convertToBuffer(reader) {
                return Buffer.from(reader);
            },
            captureFile(file) {
                const reader = new FileReader();
                if (typeof file !== 'undefined') {
                    this.fileName = file.target.files[0].name;

                    reader.readAsArrayBuffer(file.target.files[0]);
                    reader.onloadend = async () => {
                        this.buffer = await this.convertToBuffer(reader.result);
                    };
                } else {
                    this.buffer = '';
                }
            }
        }
    }
</script>

<style scoped>
    #mainContainer {
        background: #000000de;
        padding-top: 30vh;
        height: 100vh;
    }

    .form-control:focus {
        border-color: #FFFFFF;
        box-shadow: inset 0 .5px .5px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 255, 255);
    }

    input::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.75) !important;
    }

    input:-moz-placeholder { /* Firefox 18- */
        color:  rgba(255, 255, 255, 0.75) !important;
    }

    input::-moz-placeholder {  /* Firefox 19+ */
        color:  rgba(255, 255, 255, 0.75) !important;
    }

    input:-ms-input-placeholder {
        color:  rgba(255, 255, 255, 0.75) !important;
    }
</style>

<style lang="scss">
    @import 'assets/custom.scss';
    @import '~bootstrap/scss/bootstrap.scss';
    @import '~bootstrap-vue/src/index.scss';
</style>
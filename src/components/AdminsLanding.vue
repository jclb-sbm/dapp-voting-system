<template>
    <div id="mainContainer">
        <div id='particles-js'>
        </div>
        <div id="main" class="container-fluid">
            <div class="row">
                <div class="col-6 offset-3">
                    <b-alert v-model="showDismissibleAlert" variant="dark" dismissible fade>
                        {{ notification }}
                    </b-alert>
                </div>
            </div>

            <div class="row">
                <div class="col-12 d-flex justify-content-center">
                    <h1 class="display-2 text-white">Admin Page</h1>
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

            <div class="row">
                <div class="col-3 offset-3">
                    <button class="btn btn-lg btn-outline-light btn-block mt-4" v-b-modal.setupElectionModal>
                        Setup Election
                    </button>
                </div>
                <div class="col-3">
                    <button class="btn btn-lg btn-outline-light btn-block mt-4" @click="publishResults">
                        Publish Results
                    </button>
                </div>
            </div>

            <div class="row">
                <div class="col-3 offset-3">
                    <button class="btn btn-lg btn-outline-light btn-block mt-4" @click="populateSampleCandidates">
                        Populate Samples
                    </button>
                </div>
            </div>
        </div>

        <b-modal id="setupElectionModal" header-border-variant="secondary" footer-border-variant="secondary"
            header-bg-variant="main" header-text-variant="light" body-bg-variant="main" body-text-variant="light"
            footer-bg-variant="main" footer-text-variant="light">
            <div class="container-fluid modal-container">

                <div class="row">
                    <div class="col-12">
                        <h3>Registration Phase</h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col-1 offset-1 d-flex justify-content-center timeframe-field">
                        <p>Start:</p>
                    </div>
                    <div class="col-4">
                        <date-picker v-model="regStartInput" :config="options">
                        </date-picker>
                    </div>
                    <div class="col-1 d-flex justify-content-center timeframe-field">
                        <p>Finish:</p>
                    </div>
                    <div class="col-4">
                        <date-picker v-model="regFinInput" :config="options">
                        </date-picker>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <h3>Voting Phase</h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col-1 offset-1 d-flex justify-content-center timeframe-field">
                        <p>Start:</p>
                    </div>
                    <div class="col-4">
                        <date-picker v-model="voteStartInput" :config="options">
                        </date-picker>
                    </div>
                    <div class="col-1 d-flex justify-content-center timeframe-field">
                        <p>Finish:</p>
                    </div>
                    <div class="col-4">
                        <date-picker v-model="voteFinInput" :config="options">
                        </date-picker>
                    </div>
                </div>
            </div>

            <div slot="modal-footer" class="w-100 d-flex justify-content-center">
                <button class="btn btn-light" @click.prevent="setupElection">
                    Setup Election
                </button>
            </div>
        </b-modal>

        <b-modal id="regCandidateModal" header-border-variant="secondary" footer-border-variant="secondary"
            header-bg-variant="main" header-text-variant="light" body-bg-variant="main" body-text-variant="light"
            footer-bg-variant="main" footer-text-variant="light">
            <div class="container-fluid modal-container">
                <div class="row">
                    <div class="col-12">
                        <form>
                            <div class="form-group">
                                <label for="candidateName">Candidate Name:</label>
                                <input id="candidateName" v-model="candidate.name" type="text"
                                    class="form-control bg-transparent text-white" placeholder="Enter Candidate Name">
                            </div>

                            <div class="form-group">
                                <label for="candidatePartyList">Party List:</label>
                                <input id="candidatePartyList" v-model="candidate.partyList" type="text"
                                    class="form-control bg-transparent text-white" placeholder="Enter Party List">
                            </div>

                            <div class="form-group">
                                <label for="candidacy">Running for:</label>
                                <select id="candidacy" v-model="candidate.candidacy"
                                    class="custom-select bg-transparent text-white">
                                    <option value="" disabled>Choose Candidacy</option>
                                    <option value="President">President</option>
                                    <option value="Vice President">Vice President</option>
                                    <option value="Senator">Senator</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="candidatePicture">Candidate Picture</label>

                                <div class="custom-file">
                                    <input id="candidatePicture" type="file" class="custom-file-input" accept="image/*"
                                        @change="captureFile">
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
            header-bg-variant="main" header-text-variant="light" body-bg-variant="main" body-text-variant="light"
            footer-bg-variant="main" footer-text-variant="light">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <form>
                            <div class="form-group">
                                <label for="voterName">Voter Name:</label>
                                <input id="voterName" v-model="voterName" type="text"
                                    class="form-control bg-transparent text-white" placeholder="Enter Voter Name">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="w-100 d-flex justify-content-center">
                <button class="btn btn-light" @click.prevent="registerVoter">
                    Register Voter
                </button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    require('particles.js')
    import ParticleSettings from './../assets/particles.json';
    import router from './../router.js';

    const Web3 = require('web3');
    const IPFS = require('ipfs-http-client')
    const moment = require('moment');

    const Buffer = IPFS.Buffer;
    const web3 = new Web3('ws://localhost:8545', null, {});
    const ipfs = new IPFS('/ip4/127.0.0.1/tcp/5001');

    export default {
        data() {
            return {
                options: {
                    format: 'YYYY-MM-DD',
                    useCurrent: false,
                },

                regStartInput: moment().format('YYYY-MM-DD'),
                regFinInput: moment().format('YYYY-MM-DD'),
                voteStartInput: moment().format('YYYY-MM-DD'),
                voteFinInput: moment().format('YYYY-MM-DD'),

                regStart: 0,
                regFin: 0,
                voteStart: 0,
                voteFin: 0,

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

                showDismissibleAlert: false,
                notification: null,
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
        watch: {
            regStartInput: function (newDate) {
                this.regStart = this.initDate(newDate);
            },
            regFinInput: function (newDate) {
                this.regFin = this.initDate(newDate);
            },
            voteStartInput: function (newDate) {
                this.voteStart = this.initDate(newDate);
            },
            voteFinInput: function (newDate) {
                this.voteFin = this.initDate(newDate);
            },
        },
        methods: {
            initParticlesJS() {
                particlesJS('particles-js', ParticleSettings);
            },
            displayNotification(notification) {
                this.showDismissibleAlert = true;
                this.notification = notification;
            },
            initDate: function (date) {
                // Format must be: YYYY-MM-DD
                let year = date.slice(0, 4);
                let month = date.slice(5, 7);
                let day = date.slice(8, 10);

                return moment([year, month - 1, day]);
            },
            setupElection: function () {
                let now = moment().startOf('day');

                let daysTillRegStart = 0;
                let daysTillRegFin = 0;
                let daysTillVoteStart = 0;
                let daysTillVoteFin = 0;

                if (this.regStart !== 0) {
                    daysTillRegStart = this.regStart.diff(now, 'days');
                }

                if (this.regFin !== 0) {
                    daysTillRegFin = this.regFin.diff(now, 'days');
                }

                if (this.voteStart !== 0) {
                    daysTillVoteStart = this.voteStart.diff(now, 'days');
                }

                if (this.voteFin !== 0) {
                    daysTillVoteFin = this.voteFin.diff(now, 'days');
                }

                if (daysTillRegStart < 0) {
                    this.displayNotification('Invalid Input for Registration Time Frame Start');
                    return;
                }
                else if (daysTillRegFin < 0) {
                    this.displayNotification('Invalid Input for Registration Time Frame End');
                    return;
                }
                else if (daysTillVoteStart < 0) {
                    this.displayNotification('Invalid Input for Voting Time Frame Start');
                    return;
                }
                else if (daysTillVoteFin < 0) {
                    this.displayNotification('Invalid Input for Voting Time Frame End');
                    return;
                }

                this.contract.methods
                    .resetElection(daysTillRegStart, daysTillRegFin,
                                   daysTillVoteStart, daysTillVoteFin)
                    .send({
                        from: this.defaultAccount,
                        gas: 1000000
                    },
                    (error) => {
                        if (error) {
                            this.displayNotification(error);
                            return;
                        }
                        this.displayNotification('Election has been successfully reset.');
                    });
            },
            publishResults: async function () {
                router.push({name: 'results'});
            },
            registerCandidate: async function () {

                if (this.candidate.name === null ||
                    this.candidate.partyList === null ||
                    this.candidate.candidacy === '')
                {
                    this.displayNotification('Invalid Candidate Registration Inputs');
                    return;
                }

                if (this.buffer === null || this.buffer === '') {
                    this.displayNotification('Please Upload Candidate Photo');
                    return;
                }

                let hash = await ipfs.add(this.buffer);
                this.candidate.imgHash = hash[0].hash;

                this.contract.methods
                    .registerCandidate(
                        web3.utils.asciiToHex(this.candidate.name),
                        web3.utils.asciiToHex(this.candidate.partyList),
                        this.candidate.imgHash,
                        this.candidate.candidacy)
                    .send({
                        from: this.defaultAccount,
                        gas: 1000000
                    },
                    (error) => {
                        if (error) {
                            if (error.message.slice(74, 97) === 'Registration Prohibited') {
                                this.displayNotification('Registration Prohibited');
                            }
                            else {
                                this.displayNotification(error.message);
                            }
                            return;
                        }
                        this.displayNotification(`Candidate ${this.candidate.name} for ${this.candidate.candidacy} has been successfully registered.`);
                    });

            },
            registerVoter: function () {
                this.contract.methods
                    .registerVoter(web3.utils.asciiToHex(this.voterName))
                    .send({
                        from: this.defaultAccount,
                        gas: 1000000
                    },
                    (error) => {
                        if (error) {
                            if (error.message.slice(74, 97) == 'Registration Prohibited') {
                                this.displayNotification('Registration Prohibited');
                            }
                            else if (error.message.slice(74, 111) == 'You are already registered as a voter') {
                                this.displayNotification('You are already registered as a voter');
                            }
                            else {
                                this.displayNotification(error.msg);
                            }
                            return;
                        }
                        this.displayNotification(`Voter ${this.voterName} has been successfully registered.`);
                    });
            },

            getCandidate: async function () {
                await this.contract.methods
                    .getCandidateByName(web3.utils.asciiToHex('B'), "President")
                    .call({
                        from: this.defaultAccount
                    });
            },
            getVotes: async function () {
                await this.contract.methods.getVotes(web3.utils.asciiToHex(this.candidateName),
                    web3.utils.asciiToHex(this.candidateCandidacy)).call({
                    from: this.defaultAccount
                })
            },
            convertToBuffer: async function (reader) {
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
            },
            populateSampleCandidates: async function() {
                let sampleVoterNames = ['Voter 1', 'Voter 2', 'Voter 3', 'Voter 4'];

                for (let sampleVoterName of sampleVoterNames) {
                    this.contract.methods
                        .registerVoter(web3.utils.asciiToHex(sampleVoterName))
                        .send({
                            from: this.defaultAccount,
                            gas: 1000000
                        });
                }

                let samplePresidents = [
                    {name: 'President A', partyList: 'Party List A', imgHash: 'QmRXKfh7pmfHPmhLujUAqDQouBmx9gxRppwYRPtPsVjNd8', candidacy: 'President'},
                    {name: 'President B', partyList: 'Party List B', imgHash: 'QmQSHEs35u6mNHGZZaEhiB2zdTQGv2TY2rfykiE9evAY97', candidacy: 'President'}
                ];

                for (let samplePresident of samplePresidents) {
                    this.contract.methods
                        .registerCandidate(
                            web3.utils.asciiToHex(samplePresident.name),
                            web3.utils.asciiToHex(samplePresident.partyList),
                            samplePresident.imgHash,
                            samplePresident.candidacy)
                        .send({
                            from: this.defaultAccount,
                            gas: 1000000
                        });
                }

                let sampleVicePresidents = [
                    {name: 'Vice President A', partyList: 'Party List A', imgHash: 'QmesfUZeFKSXqiMjnV2REWUbp9uP5hdRYhWpBusRsawcsv', candidacy: 'Vice President'},
                    {name: 'Vice President B', partyList: 'Party List B', imgHash: 'QmWA9YV5HYuR2iGq7HHcEZJyE9YKwM3SHxww9CVuWBGbSu', candidacy: 'Vice President'}
                ];

                for (let sampleVicePresident of sampleVicePresidents) {
                    this.contract.methods
                        .registerCandidate(
                            web3.utils.asciiToHex(sampleVicePresident.name),
                            web3.utils.asciiToHex(sampleVicePresident.partyList),
                            sampleVicePresident.imgHash,
                            sampleVicePresident.candidacy)
                        .send({
                            from: this.defaultAccount,
                            gas: 1000000
                        });
                }

                let sampleSenators = [
                    {name: 'Senator A', partyList: 'Party List A', imgHash: 'QmNN3F82TN9vQTnVbpF1R6s8q76V1Cs19sT4xF2ujBTHwJ', candidacy: 'Senator'},
                    {name: 'Senator B', partyList: 'Party List B', imgHash: 'QmPPq5CQU8TAyNdRyPwaiWzmyJ8TfBauht5ChWGmh7ENE1', candidacy: 'Senator'},
                    {name: 'Senator C', partyList: 'Party List A', imgHash: 'QmXvibC24RQVm2DsRj8d95wpTGwRQXqZdwHHuEhUEnoCvy', candidacy: 'Senator'},
                    {name: 'Senator D', partyList: 'Party List B', imgHash: 'QmWnxK2Q936LbHFS62DdMHezbKPZrZtPpLP3kBvqbJM1nS', candidacy: 'Senator'},
                    {name: 'Senator E', partyList: 'Party List A', imgHash: 'QmXLNPRdnU93dVFsUKrjmHoKGXDXSq2qzgqUNhNEVKhtQM', candidacy: 'Senator'},
                    {name: 'Senator F', partyList: 'Party List B', imgHash: 'QmNXhfysz3h4GP6aRK2jFTn2SSxX89D7jT4chhxGP5WnCm', candidacy: 'Senator'},
                    {name: 'Senator G', partyList: 'Party List A', imgHash: 'QmbXX6s3nDFch9ums5t5qVYVBTaZSjpZCEbzEyQA1c5UjB', candidacy: 'Senator'},
                    {name: 'Senator H', partyList: 'Party List B', imgHash: 'QmPcNrLVDKCp6Utb6ZyXyrA4PAASi9nzYyQvsSpBMaAdBR', candidacy: 'Senator'},
                    {name: 'Senator I', partyList: 'Party List A', imgHash: 'QmXJarkcPv8YtpoM2samrfGPog6uzzK11ev8LSohiHYbyA', candidacy: 'Senator'},
                    {name: 'Senator J', partyList: 'Party List B', imgHash: 'QmWDefcMNhjZFSsPWpp3fYpSNyFKgZ6MbsFXrXq4gowWxm', candidacy: 'Senator'},
                    {name: 'Senator K', partyList: 'Party List A', imgHash: 'QmTq3fazcK3KPjbs6tgt4WQ4fvTybdAvoVjaCUYZSUZaNG', candidacy: 'Senator'},
                    {name: 'Senator L', partyList: 'Party List B', imgHash: 'QmcPK8AG41dWofUPuk83d8BPf2Zd2dbv67tZ8oyfpXfk1H', candidacy: 'Senator'},
                    {name: 'Senator M', partyList: 'Party List A', imgHash: 'QmPof7q59bV9mLACKqekWjv9AbAGvGGrQ1CoYdMjHXAhKc', candidacy: 'Senator'},
                    {name: 'Senator N', partyList: 'Party List B', imgHash: 'QmW2Ko1dcELAiMbNxkDJSjG67QiHzrsAvhTzWG92oHGsFq', candidacy: 'Senator'}
                ];

                for (let sampleSenator of sampleSenators) {
                    this.contract.methods
                        .registerCandidate(
                            web3.utils.asciiToHex(sampleSenator.name),
                            web3.utils.asciiToHex(sampleSenator.partyList),
                            sampleSenator.imgHash,
                            sampleSenator.candidacy)
                        .send({
                            from: this.defaultAccount,
                            gas: 1000000
                        });
                }
            }
        }
    }
</script>

<style scoped>
    #mainContainer {
        background: #000000de;
        z-index: -11;
        height: 100vh;
    }

    #main {
        position: absolute;
        padding-top: 30vh;
    }

    .form-control:focus {
        border-color: #FFFFFF;
        box-shadow: inset 0 .5px .5px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 255, 255);
    }

    input::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.75) !important;
    }

    input:-moz-placeholder {
        /* Firefox 18- */
        color: rgba(255, 255, 255, 0.75) !important;
    }

    input::-moz-placeholder {
        /* Firefox 19+ */
        color: rgba(255, 255, 255, 0.75) !important;
    }

    input:-ms-input-placeholder {
        color: rgba(255, 255, 255, 0.75) !important;
    }

    canvas {
        display:block;
        position: fixed;
    }

    #particles-js {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0
    }

    .timeframe-field {
        padding-top: 5px;
    }
</style>

<style lang="scss">
    @import 'assets/custom.scss';
    @import '~bootstrap/scss/bootstrap.scss';
    @import '~bootstrap-vue/src/index.scss';
</style>
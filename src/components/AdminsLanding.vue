<template>
    <div>
        <h1>Admins</h1>

        <form>
            <input type="text" v-model="candidateName" placeholder="Name"/>
            <input type="text" v-model="candidateCandidacy"/>
            <b-form-file plain @change="captureFile" />
            <button @click.prevent="uploadPhoto">
                Upload Photo
            </button>
            <button @click.prevent="registerCandidate">
                Register Candidate
            </button>
            <button @click.prevent="getCandidate">
                Get Candidate
            </button>
            <button @click.prevent="getVotes">
                Get Candidate Votes
            </button>

            <input type="text" v-model="voterName" />
            <button @click.prevent="registerVoter">
                Register Voter
            </button>
        </form>

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
                candidateName: null,
                candidatePhotoHash: null,
                candidateCandidacy: "President",

                voterName: null,

                contract: null,
                defaultAccount: null,

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
            populateSampleCandidates: async function () {
                // 2 presidents
                let presidents = [
                                    {
                                        candidateName: 'President 1',
                                        candidatePhotoHash: 'Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc',
                                        candidateCandidacy: 'President'
                                    },
                                    {
                                        candidateName: 'President 2',
                                        candidatePhotoHash: 'Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc',
                                        candidateCandidacy: 'President'
                                    }
                                ];

                let vicePresidents = [
                                    {
                                        candidateName: 'Vice President 1',
                                        candidatePhotoHash: 'Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc',
                                        candidateCandidacy: 'Vice President'
                                    },
                                    {
                                        candidateName: 'Vice President 2',
                                        candidatePhotoHash: 'Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc',
                                        candidateCandidacy: 'Vice President'
                                    }
                                ];

                for (let i=0; i < 2; i++) {
                    await this.contract.methods
                            .registerCandidate(presidents[i].candidateName,
                                               presidents[i].candidatePhotoHash,
                                               presidents[i].candidateCandidacy)
                            .send({
                                from: this.defaultAccount,
                                gas: 1000000
                            })

                    await this.contract.methods
                            .registerCandidate(vicePresidents[i].candidateName,
                                               vicePresidents[i].candidatePhotoHash,
                                               vicePresidents[i].candidateCandidacy)
                            .send({
                                from: this.defaultAccount,
                                gas: 1000000
                            })
                }
            },
            registerCandidate: async function () {
                await this.contract.methods.registerCandidate(web3.utils.asciiToHex(this.candidateName),
                                                              this.candidatePhotoHash,
                                                              this.candidateCandidacy).send({
                    from: this.defaultAccount,
                    gas: 1000000
                })
            },
            registerVoter: async function () {
                await this.contract.methods.registerVoter(web3.utils.asciiToHex(this.voterName)).send({
                    from: this.defaultAccount
                });
            },
            getCandidate: async function () {
                let candidate = await this.contract.methods.getCandidateByName(web3.utils.asciiToHex(this.candidateName),
                                                                               this.candidateCandidacy).call({
                    from: this.defaultAccount
                })

                console.log(candidate);

                console.log(web3.utils.hexToUtf8(candidate[0]));
                console.log(web3.utils.hexToUtf8(candidate[1]));
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
                    reader.readAsArrayBuffer(file.target.files[0]);
                    reader.onloadend = async () => {
                        this.buffer = await this.convertToBuffer(reader.result);
                    };
                } else {
                    this.buffer = '';
                }
            },
            uploadPhoto: function () {
                ipfs.add(this.buffer)
                    .then(hashedImg => {
                        this.candidatePhotoHash = hashedImg[0].hash;
                        console.log(`https://ipfs.io/ipfs/${this.candidatePhotoHash}`);
                    })
            }
        }
    }
</script>


<style scoped>

</style>
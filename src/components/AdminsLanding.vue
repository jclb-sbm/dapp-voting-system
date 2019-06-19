<template>
    <div>
        <h1>Admins</h1>

        <form>
            <input type="text" v-model="candidateName" />
            <button @click.prevent="registerCandidate">
                Register Candidate
            </button>
            <button @click.prevent="getCandidate">
                Get Candidate
            </button>
            <button @click.prevent="getVotes">
                Get Candidate Votes
            </button>
        </form>

        <b-form-file plain @change="captureFile" />
        <button @click.prevent="uploadPhoto">
            Upload Photo
        </button>

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
            registerCandidate: function () {
                this.contract
                    .methods
                    .registerCandidate(this.candidateName)
                    .send({
                        from: this.defaultAccount
                    })
                    .then((result) => {
                        console.log(result);
                    });
            },
            getCandidate: function () {
                this.contract
                    .methods
                    .getCandidate(this.candidateName)
                    .call({
                        from: this.defaultAccount
                    })
                    .then(result => {
                        console.log(result);
                    });
            },
            getVotes: function () {
                this.contract
                    .methods
                    .getVotes(this.candidateName)
                    .call({
                        from: this.defaultAccount
                    })
                    .then(result => {
                        console.log(result.toString());
                    });
            },
            async convertToBuffer(reader) {
                return Buffer.from(reader);
            },
            captureFile(file) {
                console.log(file);
                const reader = new FileReader();
                if (typeof file !== 'undefined') {
                    reader.readAsArrayBuffer(file.target.files[0]);
                    reader.onloadend = async () => {
                        this.buffer = await this.convertToBuffer(reader.result);
                    };
                }
                else {
                    this.buffer = '';
                }
            },
            uploadPhoto: function () {
                console.log(this.buffer);
                ipfs.add(this.buffer)
                    .then(hashedImg => {
                        let imgHash = hashedImg[0].hash;
                        console.log(imgHash);
                        console.log(`https://ipfs.io/ipfs/${imgHash}`);
                    })
            }
        }
    }
</script>


<style scoped>

</style>
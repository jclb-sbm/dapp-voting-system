<template>
    <div>
        <h1>Admins</h1>

        <form>
            <input type="text" v-model="candidateName"/>
            <button v-on:click.prevent ="registerCandidate">
                Register Candidate
            </button>
            <button v-on:click.prevent ="getCandidate">
                Get Candidate
            </button>
        </form>

    </div>
</template>

<script>
    const Web3 = require('web3');
    const web3 = new Web3('ws://localhost:8545', null, {});

    export default {
        data() {
            return {
                candidateName: null,
                contract: null,
                defaultAccount: null,
            }
        },
        mounted: async function() {
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
            }
        }
    }
</script>


<style scoped>

</style>
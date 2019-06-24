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

    export default {
        data() {
            return {
                presCandidates: [{name: 'President A', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 49},
                                 {name: 'President B', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 50}],

                vicePresCandidates: [{name: 'Vice President A', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 61},
                                     {name: 'Vice President B', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 60}],

                senCandidates: [{name: 'Senator A', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 10},
                                {name: 'Senator B', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 20},
                                {name: 'Senator C', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 30},
                                {name: 'Senator D', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 40},
                                {name: 'Senator E', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 50},
                                {name: 'Senator F', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 60},
                                {name: 'Senator G', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 70},
                                {name: 'Senator H', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 80},
                                {name: 'Senator I', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 90},
                                {name: 'Senator J', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 100},
                                {name: 'Senator K', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 120},
                                {name: 'Senator L', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 130},
                                {name: 'Senator M', partyList: 'Party List A', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 140},
                                {name: 'Senator N', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 150},
                                {name: 'Senator O', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 160},
                                {name: 'Senator P', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 170},
                                {name: 'Senator Q', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 180},
                                {name: 'Senator R', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 190},
                                {name: 'Senator S', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 200},
                                {name: 'Senator T', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 210},
                                {name: 'Senator U', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 220},
                                {name: 'Senator W', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 230},
                                {name: 'Senator X', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 240},
                                {name: 'Senator Y', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 250},
                                {name: 'Senator Z', partyList: 'Party List B', imgHash: 'http://127.0.0.1:8080/ipfs/Qmf4JxXH1cNSwD9yYLzauc7mH8a3fbXip6Q7r1pFjCz9mc', votes: 260}],
            }
        },
        created() {
            this.$nextTick(() => {
                this.initParticlesJS()
            })
        },
        mounted() {
            this.presCandidates.sort((a, b) => a.votes < b.votes);
            this.vicePresCandidates.sort((a, b) => a.votes < b.votes);
            this.senCandidates.sort((a, b) => a.votes < b.votes);
        },
        methods: {
            initParticlesJS() {
                particlesJS('particles-js', ParticleSettings);
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
<template>
    <div>
        <div id='particles-js'>
        </div>
        <div class='center'>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-12">
                        <h1 class="display-1 text-white text-nowrap">Decentralized Voting System</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="offset-sm-4 col-sm-2">
                        <router-link :to="{ name: 'voters' }">
                            <button type="button" class="btn btn-lg btn-outline-light btn-block">Voters</button>
                        </router-link>
                    </div>
                    <div class="col-sm-2">
                        <router-link :to="{ name: 'admins' }">
                            <button type="button" class="btn btn-lg btn-outline-light btn-block">Admins</button>
                        </router-link>
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
        name: 'MainLanding',

        created() {
            this.$nextTick(() => {
                this.initParticlesJS()
            })
        },

        methods: {
            initParticlesJS() {
                particlesJS('particles-js', ParticleSettings);
            }
        }
    }
</script>

<style scoped>
    #particles-js {
        background: #000000de;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0
    }

    canvas {
        display:block;
        background: rgb(33,36,50);
        position: fixed;
    }

    .center {
        position: absolute;
        top: 50%;
        left: 50%;
        -moz-transform: translateX(-50%) translateY(-50%);
        -webkit-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
    }

    a {
        text-decoration: none;
    }
</style>
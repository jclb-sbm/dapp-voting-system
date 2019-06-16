<template>
    <div>
        <div id='particles-js'></div>
        <div id='login'>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-12">
                        <h1 class="display-1 text-white text-nowrap">Decentralized Voting System</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="offset-sm-4 col-sm-2">
                        <button type="button" class="btn btn-lg btn-outline-light btn-block">Log-in</button>
                    </div>
                    <div class="col-sm-2">
                        <button type="button" class="btn btn-lg btn-outline-light btn-block">Register</button>
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
        name: 'ParticlesJS',

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
    }

    #login {
        position: absolute;
        top: 50%;
        left: 50%;
        -moz-transform: translateX(-50%) translateY(-50%);
        -webkit-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
    }
</style>
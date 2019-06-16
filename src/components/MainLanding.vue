<template>
    <div>
        <div id='particles-js'></div>
        <div id='login'>
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
        width: 100%;
        height: 100%;
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

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import router from './router.js';
import App from './App.vue'

Vue.use(BootstrapVue);
Vue.config.productionTip = false

Vue.mixin({
  data: function() {
    return {
      gIsVoterLoggedIn: false,
      gVoter: null
    }
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

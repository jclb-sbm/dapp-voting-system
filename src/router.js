import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

let router  = new Router({
    mode: 'history',
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            name: 'main',
            component: resolve => {
                require.ensure(['@/components/MainLanding.vue'], () => {
                    resolve(require('@/components/MainLanding.vue'));
                });
            }
        },
        {
            path: '/admins',
            name: 'admins',
            component: resolve => {
                require.ensure(['@/components/AdminsLanding.vue'], () => {
                    resolve(require('@/components/AdminsLanding.vue'));
                });
            }
        },
        {
            path: '/admin/:id',
            name: 'admin',
            component: resolve => {
                require.ensure(['@/components/Admin.vue'], () => {
                    resolve(require('@/components/Admin.vue'));
                });
            }
        },
        {
            path: '/voters',
            name: 'voters',
            component: resolve => {
                require.ensure(['@/components/VotersLanding.vue'], () => {
                    resolve(require('@/components/VotersLanding.vue'));
                });
            }
        },
        {
            path: '/voter',
            name: 'voter',
            component: resolve => {
                require.ensure(['@/components/Voter.vue'], () => {
                    resolve(require('@/components/Voter.vue'));
                });
            }
        }
    ]
});

export default router
import Vue from 'vue';
import VueRouter from 'vue-router';
import Game from './views/Game.vue';
import Login from './views/Login.vue';
import Top from './views/Top.vue';
import PopUp from '.views/PopUp.vue';

Vue.use(VueRouter);

const routes = [
    { path: '/', component: Top },
    { path: '/login', component: Login },
    { path: '/game', component: Game },
    { path: '/popup', component: PopUp}
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

export default router;

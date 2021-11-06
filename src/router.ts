import Vue from 'vue';
import VueRouter from 'vue-router';
import Game from './views/Game.vue';
import Login from './views/Login.vue';
import Top from './views/Top.vue';

Vue.use(VueRouter);

const routes = [
    { path: '/', component: Top },
    { path: '/login', component: Login },
    { path: '/game', component: Game },
];

const router = new VueRouter({
    routes,
});

export default router;

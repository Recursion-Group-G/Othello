<template>
    <v-app>
        <v-main>
            <Login />
            <Game />
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Game from './views/Game.vue';
import Login from './views/Login.vue';

export default Vue.extend({
    name: 'App',

    components: {
        Game,
        Login,
    },

    data: () => ({
        //
    }),
});
</script>

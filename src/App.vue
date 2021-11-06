<template>
    <v-app>
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Game from './views/Game.vue';
import Login from './views/Login.vue';
import Top from './views/Top.vue';

export default Vue.extend({
    name: 'App',
    data: () => ({
        //
    }),
});
</script>

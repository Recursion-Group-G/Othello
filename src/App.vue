<template>
  <v-app>
    <v-main>
      <Game/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Game from './views/Game.vue'

export default Vue.extend({
  name: 'App',

  components: {
    Game,
  },

  data: () => ({
    //
  }),
});
</script>

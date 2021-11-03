<template>
  <v-app>
    <v-main>
      <Top/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Top from './views/Top.vue'
export default Vue.extend({
  name: 'App',

  components: {
    Top
  },

  data: () => ({
    //
  }),
});
</script>

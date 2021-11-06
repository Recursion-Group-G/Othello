<template>
  <v-app>
    <v-main>
      <PopUp/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import PopUp from './components/PopUp.vue';

export default Vue.extend({
  name: 'App',

  components: {
    PopUp,
  },

  data: () => ({
    //
  }),
});
</script>

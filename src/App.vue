<template>
    <v-app>
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import PopUp from './views/PopUp.vue';

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

<template>
    <v-app>
        <v-main>
            <!-- 確認用developへメー時する時に削除 -->
            <PopUp/>
            <router-view></router-view>
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

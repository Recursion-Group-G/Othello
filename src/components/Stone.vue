<template>
    <!-- Boardを作成するモジュールとGmaeページでBoardを元に作成されるゲームボードが実装されたら使うコード -->
    <!-- <div class="size-fill d-flex justify-center align-center"  v-if="stone !== null" > -->
    <!-- <v-sheet
        v-if="isVisible"
        class="mx-auto transition-swing rounded-circle stone-style"
        elevation="12"
        color="#000000"
    ></v-sheet> -->
    <div class="size-fill d-flex justify-center align-center">
        <v-sheet
            class="mx-auto transition-swing rounded-circle stone-style"
            elevation="12"
            :color="color"
        ></v-sheet>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Player from '@/models/player';
import Stone from '@/models/stone';

export default Vue.extend({
    props: {
        // stone:Stone | null,
        // isVisible:Boolean,
    },
    data() {
        return {
            color: '#000000',
        };
    },
});
</script>

<style scoped>
.size-fill {
    width: 100%;
    height: 100%;
}

.stone-style {
    width: 90%;
    height: 90%;
}
</style>

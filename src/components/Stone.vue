<template>
    <!-- Boardを作成するモジュールとGmaeページでBoardを元に作成されるゲームボードが実装されたら使うコード -->
    <!-- <div v-if="!isEmpty()" class="size-fill d-flex justify-center align-center"   > -->
    <!-- <v-sheet
        v-if="isVisible"
        class="mx-auto transition-swing rounded-circle stone-style"
        elevation="12"
        color="stone.color.code"
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
            //本来はStone自体を受け取り、その状態(null or Colorがある)によってStoneコンポーネントの色も変わる。
            //今は仮で黒に
            color: Config.stone.color.black.code,
        };
    },
    methods:{
        // isEmpty(): boolean{
        //     return this.stone === null;
        // }
    }
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

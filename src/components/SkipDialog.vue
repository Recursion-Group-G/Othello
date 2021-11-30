<template>
  <div class="text-center">
    <v-dialog v-model="skipDialog">
        <div>
            <div id="skip-dialog" >
                <v-card id="content" class="d-flex justify-center">
                    <div>
                        <h1>>>>>>>>>>>>>>>>>>>>>>>>></h1>
                        <h1 class="text-center m-3">Skip {{player.name}} !</h1>
                        <p class="text-center color-gray">{{ player.name }} has no place to put his/her stone...</p>
                        <h1>>>>>>>>>>>>>>>>>>>>>>>>></h1>
                    </div>
                </v-card>
            </div>
        </div>
    </v-dialog>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    props: ['skipDialog', 'player'],

})
</script>

<style>
#skip-dialog {
    /* 要素を重ねた時の順番 */
    z-index: 1;

    /* 画面全体を覆う設定 */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    /* 画面の中央に要素を表示させる設定 */
    display: flex;
    align-items: center;
    justify-content: center;
}

#content {
    z-index: 2;
    width: 50%;
    padding: 1em;
    background: #fff;
}

.color-gray {
    color: #999;
}
</style>
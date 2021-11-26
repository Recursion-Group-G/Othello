<template>
    <div>
        <div id="popup" v-show="isVisible">
            <v-card id="content" class="d-flex justify-center">
                <div>
                    <h1 class="text-center">`${this.returnWinner()}`</h1>

                    <v-row>
                        <v-col cols="12" sm="6">
                            <router-link to="/top">
                                <v-btn
                                    class="deep-purple accent-3 white--text"
                                    elevation="24"
                                    block
                                >
                                    Top
                                </v-btn>
                            </router-link>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <router-link to="/game">
                                <v-btn
                                    class="deep-purple accent-3 white--text"
                                    elevation="24"
                                    block
                                >
                                    Retry
                                </v-btn>
                            </router-link>
                        </v-col>
                    </v-row>
                </div>
            </v-card>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    name: 'PopUp',
    
    data: () => ({
        isVisible: true,
    }),

    props: {
        table: {
            type: Object,
        },
    },

    methods: {
        openModal(): void {
            this.isVisible = true;
        },
        closeModal(): void {
            this.isVisible = false;
        },
        returnWinner(): string {
            if (this.table.players[0].score === this.table.players[1].score) {
                return 'Tie Breaker';
            } else {
                return this.table.players[0].score > this.table.players[1].score
                    ? this.table.players[0].name + ' is Winner'
                    : this.table.players[1].name + ' is Winner';
            }
        },
 
    },

    computed: {
    },
});
</script>

<style>
#popup {
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
</style>

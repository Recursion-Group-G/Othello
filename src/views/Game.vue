<template>
        <div class="v-content">
            <v-container class="d-flex justify-center text-center mt-5">
                <!-- Players上部(スマホの時のみ表示) -->
                <!-- Playerの配列は仮、プレイヤーの枚数"2"は後でプレイヤーの配列や点数の状態で書き換え -->
                <h2 class="player-font" v-if="isXs">{{ players[1] }}: 2</h2>
            </v-container>
            <v-container class="board">
                <v-row class="d-flex justify-center my-3">
                    <!-- Board -->
                    <div>
                        <div
                            v-for="i in board.size.row"
                            :key="i"
                            class="d-flex"
                        >
                            <div v-for="j in board.size.col" :key="j">
                                <div
                                    :id="`${i}-${j}`"
                                    class="board-square"
                                    @click="clickToFlip(`${i}-${j}`)"
                                ></div>
                            </div>
                        </div>
                    </div>
                </v-row>
            </v-container>
            <!-- Players下部 -->
            <v-container>
                <v-row
                    class="d-flex space-between text-center mb-5"
                    v-if="!isXs"
                >
                    <!-- Playerの配列は仮、プレイヤーの枚数"2"は後で点数の状態で書き換え -->
                    <v-col v-for="k in players" :key="k">
                        <h2 class="player-font">{{ k }}: 2</h2>
                    </v-col>
                </v-row>
                <v-row class="d-flex space-between text-center mb-5" v-else>
                    <v-col>
                        <h2 class="player-font">{{ players[0] }}: 2</h2>
                    </v-col>
                </v-row>
            </v-container>
        </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FlipAnimation from '@/modules/flipAnimation';
import router from '../router';

export default Vue.extend({
    name: 'Game',
    props: ['table'],
    components: {},
    data: () => ({
        //後でconfig.tsに移行する
        board: {
            size: {
                row: 8,
                col: 8,
            },
        },
        //仮のPlayer配列
        players: ['Player1', 'Player2'],
        tableJson: '',
    }),
    created: function () {
        //今は画面遷移しないようにコメントアウト
        // this.validateTable();
        this.saveLocalStorage();
        this.getLocalStorage();
    },
    computed: {
        //スマホの画面判定
        isXs() {
            return this.$vuetify.breakpoint.name === 'xs';
        },
    },
    methods: {
        validateTable: function () {
            //必要な情報がnullであればトップページへ画面遷移
            if (
                this.table == null ||
                this.table.players == null ||
                this.table.board == null
            )
                router.push('/');
        },
        saveLocalStorage: function () {
            let tableJsonDecoded = JSON.stringify(this.table);
            localStorage.setItem("table", tableJsonDecoded);
        },
        getLocalStorage: function() {
            this.tableJson = JSON.stringify(localStorage.getItem("table"));
        },
        clearLocalStorage: function() {
            localStorage.clear();
        },
        clickToFlip: async function (id: string) {
            //とりあえず黒から白へ
            const animation = new FlipAnimation(id, '#ffffff', '#000000');
            await animation.flip(); //ひっくり返るのを待つ時はawaitつけて、待つ必要なしの場合はつけないでOK
            animation.remove();
        },
    },
});
</script>

<style>
/* Google fonts */
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.v-content {
    background-color: #ffffff;
}

.board-square {
    width: 90px;
    height: 90px;

    /* color: #ffffff; */
    cursor: pointer;
    /* transition: all 0.2s; */
    gap: 20px;
    border-radius: 0px;
    /* backdrop-filterが
    ないと近くの中に収まらないけど
    あると重たくなってレートが遅くなるので
    0pxにしておく */
    backdrop-filter: blur(0px);
    background-color: #09c15a;
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 6px rgba(255, 255, 255, 0.4) solid;
    border-bottom: 6px rgba(40, 40, 40, 0.35) solid;
    border-right: 6px rgba(40, 40, 40, 0.35) solid;
}

/* テスト用に一旦コメントアウト */
/* .board-square:hover {
    opacity: 0.2;
    background: #000000;
} */

.player-font {
    font-family: 'Lato';
    font-size: 40px;
}

@media screen and (max-width: 480px) {
    /* 480px以下に適用されるCSS（スマホ用） */
    .board {
        width: 100%;
    }

    .board-square {
        width: 50px;
        height: 50px;
        color: #ffffff;
        cursor: pointer;
        transition: all 0.2s;
        gap: 20px;
        border-radius: 0px;
        backdrop-filter: blur(9px);
        background-color: #09c15a;
        box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
        border: 3.36px rgba(255, 255, 255, 0.4) solid;
        border-bottom: 3.36px rgba(40, 40, 40, 0.35) solid;
        border-right: 3.36px rgba(40, 40, 40, 0.35) solid;
    }
}
</style>

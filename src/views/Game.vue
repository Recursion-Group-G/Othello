<template>
    <v-app>
        <v-content class="v-content">    
            <v-container>
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
                            <div
                                v-for="j in board.size.row"
                                :key="j"
                            >
                                <div class="glass-square"></div>
                            </div>
                        </div>
                    </div>

                </v-row>
            </v-container>
            <!-- Players -->
            <v-container>
                <v-row class="d-flex space-between text-center mb-5">
                    <!-- v-forの"2"、Playerの名前、プレイヤーの枚数"2"は後でプレイヤーの配列や点数の状態で書き換え-->
                    <v-col v-for="k in 2" 
                        :key="k"
                    >
                    <h2 class="player-font">Player{{k}}: 2</h2> 
                    </v-col>
                </v-row>
            </v-container>
            
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'Game',
    components: {
    },
    data: () => ({
        //後でconfig.tsに移行する
        board: {
            color:{
                white: '#ffffff'
            },
            size:{
                row: 8,
                col: 8
            }
        },
    }),

});
</script>

<style>
/* Google fonts */
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.v-content {
    /*background-color: #ebebeb;*/
    background-color: #ffffff;
  /*background-color: #00a86b;*/
}

.glass-square{
    width: 90px;
    height: 90px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;
    gap: 20px;
    border-radius: 0px;
    backdrop-filter: blur(9px);
    /*background-color: rgba(255,255,255, 0.5);*/
    background-color: #09c15a;    
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 6px rgba(255,255,255,0.4) solid;
    border-bottom: 6px rgba(40,40,40,0.35) solid;
    border-right: 6px rgba(40,40,40,0.35) solid;
}

.glass-square:hover{
    opacity: 0.2;
    background: #000000;
}

.neumorphism-square{
    width: 100px;
    height: 100px;
    border-radius: 0px;
/*
    background: #09c15a;
    box-shadow:  8px 8px 16px #4ea260,
                -8px -8px 16px #88ffa6;
*/
    background: linear-gradient(145deg, #08ae51, #0acf60);
    box-shadow:  8px 8px 16px #08ac50,
                -8px -8px 16px #0ad664;
}


.player-font {
   font-family: "Lato";
   font-size: 40px;
}


@media screen and (max-width: 480px) {
    /* 480px以下に適用されるCSS（スマホ用） */
    .board {
        width: 100%;
    }

    .glass-square{
        width: 50px;
        height: 50px;
        color: #ffffff;
        cursor: pointer;
        transition: all 0.2s;
        gap: 20px;
        border-radius: 0px;
        backdrop-filter: blur(9px);
        /*background-color: rgba(255,255,255, 0.5);*/
        background-color: #09c15a;    
        box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
        border: 3.36px rgba(255,255,255,0.4) solid;
        border-bottom: 3.36px rgba(40,40,40,0.35) solid;
        border-right: 3.36px rgba(40,40,40,0.35) solid;
    }

}
</style>

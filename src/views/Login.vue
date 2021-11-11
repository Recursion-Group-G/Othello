<template>
    <v-app>
        <v-content class="fill-height pa-1">
            <v-row justify="center">
                <v-col cols="10" sm="6" md="4">
                    <h1 class="page-title">Select Mode</h1>
                    <!--Select Mode-->
                    <v-select
                        v-model="selectedMode"
                        :items="modes"
                        item-text="modeString"
                        item-value="modeName"
                        label="Game Mode"
                        return-object
                    ></v-select>
                    <!--Player1 #Player情報はv-forで書き直し？-->
                    <v-text-field
                        v-model="playerInfo.player1.name"
                        :counter="10"
                        label="Name（Player1）"
                        required
                    ></v-text-field>
                    <!--後ほどプレイヤー毎の選択により連動するselectに変更-->
                    <v-select
                        v-model="playerInfo.player1.color"
                        :items="colors"
                        label="Color (Player1)"
                    ></v-select>

                    <v-text-field
                        v-model="playerInfo.player2.name"
                        :counter="10"
                        label="Name（Player2）"
                        required
                    ></v-text-field>
                    <v-select
                        v-model="playerInfo.player2.color"
                        :items="colors"
                        label="Color (Player2)"
                    ></v-select>

                    <v-row class="d-flex justify-center mt-10 white--text">
                        <router-link to="/game" class="button-link">
                            <v-btn
                                @click="makePlayerModel"
                                dark large color="deep-purple">
                                Game Start
                            </v-btn>
                        </router-link>
                    </v-row>
                </v-col>
            </v-row>
        </v-content>
    </v-app>
</template>
<script lang="ts">
import Vue from 'vue';
import Player from '../models/player'

export default Vue.extend({
    name: 'Login',
    data() {
        return {
            selectedMode: {modeString: '', modeName: ''},
            modes: [
                {modeString: 'Player VS Player', modeName: 'versusPlayer'},
                {modeString: 'Player VS CPU', modeName: 'versusCPU'},
            ],

            colors: ['white', 'black'],

            playerInfo: {
                player1: {
                    name: '',
                    color: '',
                }, 
                player2: {
                    name: '',
                    color: '',
                } 
            },

            cpuPlayerName: 'CPU',
            initialScore: 2, 
            
        };
    },


    methods: {
        makePlayerModel(){
            let players: Array<Player> = new Array(2); //2は後でconfigで書き換え
            //playersとplayerInfoの長さをassertした方がよいかも
            if(this.selectedMode.modeName === 'versusCPU') this.playerInfo.player2.name = this.cpuPlayerName;
            Object.entries(this.playerInfo).map(([playerName, {color}])=>{
                if(playerName === this.cpuPlayerName) players.push(this.createCpuPlayer(playerName, this.initialScore, color));
                else players.push(this.createHumanPlayer(playerName, this.initialScore, color));
            });
            this.$emit('playersData', players);
        },
        assignColor(players: Array<Player>){
            players.map((players)=>{
                players.color = ''
            });
        },

        createCpuPlayer(playerName: string, score: number, color: string){
            return new Player(playerName, score, color, true);
        },

        createHumanPlayer(playerName: string, score: number, color: string){
            return new Player(playerName, score, color, false);
        },

        /* from player.ts
        class Player {
            name: string;
            score: number;
            color: string;
            isCpu: boolean;

            constructor(name: string, score: number, color: string, isCpu: boolean) {
                this.name = name;
                this.score = score;
                this.color = color;
                this.isCpu = isCpu;
            }
        }
        */
    }


});



</script>

<style>
.page-title {
    text-align: center;
    margin-top: 120px;
    font-size: 40px;
}

.button-link {
    text-decoration: none;
}
</style>

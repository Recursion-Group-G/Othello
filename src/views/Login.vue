<template>
    <v-app>
        <v-content class="fill-height pa-1">
            <v-row justify="center">
                <v-col cols="10" sm="6" md="4">
                    <h1 class="page-title">Select Mode</h1>
                    <!--Select Mode-->
                    <v-select
                        class="mt-10"
                        v-model="selectedMode"
                        :items="modes"
                        item-text="modeString"
                        item-value="modeName"
                        label="Game Mode"
                        return-object
                    ></v-select>
                    <!--Player-->
                    <template v-for="(player, index) in players">
                        <v-text-field
                            :key="index"
                            class="mt-10"
                            v-model="player.name"
                            :counter="10"
                            :label="`Name (Player${index + 1})`"
                            required
                        ></v-text-field>
                        <!--後ほどプレイヤー毎の選択により連動するselectに変更-->
                        <v-select
                            :key="index"
                            v-model="player.color"
                            :items="colors"
                            :label="`Color (Player${index + 1})`"
                        ></v-select>
                    </template>
                    <!-- Game Start button -->
                    <v-row class="d-flex justify-center mt-10 white--text">
                        <router-link to="/game" class="button-link">
                            <v-btn
                                @click="sendPlayers"
                                dark
                                large
                                color="deep-purple"
                            >
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
import Player from '../models/player';
import Config from '../config';

export default Vue.extend({
    name: 'Login',
    data() {
        return {
            selectedMode: { modeString: '', modeName: '' },
            modes: [
                { modeString: 'Player VS Player', modeName: 'versusPlayer' },
                { modeString: 'Player VS CPU', modeName: 'versusCPU' },
            ],

            colors: Object.keys(Config.stone.color),

            players: new Array(Config.player.number.min)
                .fill({})
                .map(
                    () => new Player('', Config.player.initialScore, '', false)
                ),

            cpuPlayerName: 'CPU',
        };
    },

    methods: {
        sendPlayers() {
            if (this.selectedMode.modeName === 'versusCPU')
                this.switchCpuPlayer(this.players[Config.player.cpuIndex]); //ConfigにCPUがどこになるのかIndex追加
            this.$emit('playersData', this.players);
        },

        switchCpuPlayer(player: Player) {
            player.name = this.cpuPlayerName;
            player.color = this.judgeCpuColor();
            player.isCpu = true;
        },

        judgeCpuColor(): string {
            if (this.players[Config.player.playerIndex].color === 'white')
                return 'black';
            else if (this.players[Config.player.playerIndex].color === 'black')
                return 'white';
            else return ''; //nullにするとplayer.colorにもnullの型指定追加が必要なので一旦初期値にしてます。どこかでエラー処理を書いた方がいいかもしれないです。
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
    },
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

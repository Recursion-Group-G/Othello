<template>
    <div class="fill-height pa-1">
        <v-row justify="center">
            <v-col cols="10" sm="6" md="4">
                <h1 class="page-title">Select Mode</h1>
                <!--Select Mode-->
                <v-form ref="form" lazy-validation>
                    <v-select
                        class="mt-10"
                        v-model="selectedMode"
                        :items="Config.modes"
                        label="Game Mode"
                        return-object
                        :rules="modeRules"
                        required
                    ></v-select>
                    <!--Player-->
                    <div v-if="isPvPMode">
                        <div v-for="(player, index) in players" :key="index">
                            <v-text-field
                                class="mt-10"
                                v-model="player.name"
                                :counter="Config.nameCounter"
                                :label="`Name (Player${index + 1})`"
                                :rules="nameRules"
                                required
                            ></v-text-field>
                            <!--後ほどプレイヤー毎の選択により連動するselectに変更-->
                            <v-select
                                v-model="player.color"
                                :items="colors"
                                item-text="name"
                                item-value="obj"
                                :label="`Color (Player${index + 1})`"
                                :rules="colorRules"
                                required
                            ></v-select>
                        </div>
                    </div>
                    <!--Modeの選択なし、PvCモードの時は一つの表示-->
                    <div v-else>
                        <v-text-field
                            class="mt-10"
                            v-model="players[Config.player.PlayerIndex].name"
                            :counter="Config.nameCounter"
                            :label="`Name (Player${
                                Config.player.PlayerIndex + 1
                            })`"
                            :rules="nameRules"
                            required
                        ></v-text-field>
                        <v-select
                            v-model="players[Config.player.PlayerIndex].color"
                            :items="colors"
                            item-text="name"
                            item-value="obj"
                            :label="`Color (Player${
                                Config.player.PlayerIndex + 1
                            })`"
                            :rules="colorRules"
                            required
                        ></v-select>
                    </div>
                </v-form>
                <v-row class="d-flex justify-center mt-10 white--text" v-else>
                    <router-link
                        @click.native="sendPlayers"
                        to="/game"
                        class="button-link"
                    >
                        <v-btn color="deep-purple accent-3 white--text">
                            Game Start
                        </v-btn>
                    </router-link>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Player from '../models/player';
import Config from '../config';
import Color from '../interfaces/color';

export default Vue.extend({
    name: 'Login',
    data() {
        return {
            Config: Config,
            selectedMode: '',
            colors: Object.keys(Config.stone.color).map((colorString) => {
                return {
                    name: colorString,
                    obj: Config.stone.color[colorString],
                };
            }),
            players: new Array(Config.player.number.min)
                .fill({})
                .map(() => new Player()),
            modeRules: [(v: any) => !!v || 'Mode is required'],
            nameRules: [
                (v: any) => !!v || 'Name is required',
                (v: any) =>
                    v.length <= Config.nameCounter ||
                    `Name must be less than ${Config.nameCounter} characters`,
            ],
            colorRules: [(v: any) => !!v.code || 'Color is required'],
        };
    },

    methods: {
        sendPlayers() {
            const cpuIndex: number = Config.player.cpuIndex; //ConfigにCPUがどこになるのかIndex追加
            if (this.isPvCMode) {
                this.switchCpuPlayer(this.players[cpuIndex]);
            }
            this.$emit('playersData', this.players);
        },

        switchCpuPlayer(player: Player) {
            player.name = Config.player.cpuName;
            // player.color = this.judgeCpuColor();
            player.isCpu = true;
        },

        judgeCpuColor(): Color {
            const color: Color | null = this.players[Config.player.playerIndex].color;
            if (color == null) {
                return Config.stone.color.black;
            } else if (color.id === Config.stone.color.white.id) {
                return Config.stone.color.black;
            } else {
                return Config.stone.color.white;
            }
        },

        doValidation(): void {
            (this.$refs.form as any).validate();
        },

        // checkValidationPlayerName(): boolean {
        //     const playerIndex: number = Config.player.playerIndex;
        //     const indexModePvC: number = Config.indexModePvC;
        //     if (
        //         this.selectedMode ===
        //         Config.modes[indexModePvC]
        //     ) {
        //         return this.players[playerIndex].name === '';
        //     } else {
        //         for (let player in this.players) {
        //             if (this.players[player].name === '') {
        //                 return true;
        //             }
        //         }
        //         return false;
        //     }
        // },
        // checkValidationPlayerColor(): boolean {
        //     const playerIndex: number = Config.player.playerIndex;
        //     if (this.isPvCMode) {
        //         /*
        //         this.players[playerIndex].color.codeの指定の場合、this.players[playerIndex].colorはStoneになり直接アクセス不可
        //         this.players[playerIndex].color.color.codeの指定の場合、未選択時と選択時で動作が異なる
        //         未選択時：this.players[playerIndex].color.color.codeは
        //         選択時：this.players[playerIndex].color.color.codeでアクセスが出来なくなってしまう
        //         this.players[playerIndex].color.codeの指定だと先に進まなくなるため一旦仮で設定
        //         (this.players[playerIndex].colorだとColor未選択時でも次の画面に進める)
        //         */
        //         return this.players[playerIndex].color.code === '';
        //     } else {
        //         for (let player in this.players) {
        //             if (this.players[player].color.code === '') {
        //                 return true;
        //             }
        //         }
        //         return false;
        //     }
        // },
    },

    computed: {
        isPvCMode(): boolean {
            return this.selectedMode === Config.modes.PvC;
        },
        isPvPMode(): boolean {
            return this.selectedMode === Config.modes.PvP;
        },
        //router-linkに飛んだあとに@clickが反応してしまうため、checkValidationを別に用意
        // checkValidation(): boolean {
        //     return (
        //         this.selectedMode === '' ||
        //         this.checkValidationPlayerName() ||
        //         this.checkValidationPlayerColor()
        //     );
        // },
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

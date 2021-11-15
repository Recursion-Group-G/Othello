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
                        :items="Config.top.modes"
                        item-text="modeString"
                        item-value="modeName"
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
                                :counter="Config.top.nameCounter"
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
                            :counter="Config.top.nameCounter"
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
                <!-- Game Start button -->
                <!-- router-linkに飛んだあとに@clickが反応してしまうため、checkValidationを別に用意-->
                <v-row
                    class="d-flex justify-center mt-10 white--text"
                    v-if="checkValidation"
                >
                    <v-btn
                        @click="doValidation"
                        color="deep-purple accent-3 white--text"
                    >
                        Game Start
                    </v-btn>
                </v-row>

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
            selectedMode: { modeString: '', modeName: '' },
            colors: Object.keys(Config.stone.color).map((colorString) => {
                return {
                    name: colorString,
                    obj: Config.stone.color[colorString],
                };
            }),
            players: new Array(Config.player.number.min)
                .fill({})
                .map(
                    () =>
                        new Player(
                            '',
                            Config.player.initialScore,
                            new Color({ code: '', id: 0 }),
                            false
                        )
                ),
            modeRules: [(v: any) => !!v.modeName || 'Mode is required'],
            nameRules: [
                (v: any) => !!v || 'Name is required',
                (v: any) =>
                    v.length <= Config.top.nameCounter ||
                    `Name must be less than ${Config.top.nameCounter} characters`,
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
            player.color = this.judgeCpuColor();
            player.isCpu = true;
        },

        judgeCpuColor(): Color {
            /*
            Property 'color' is missing in type '{ code: string; id: number; }' but required in type 'Stone'.
            修正予定コードでは上記メッセージが出るため、一旦仮のコード。StoneのInterfaceディレクトリ作成が必要
            */
            const color = this.players[Config.player.playerIndex].color.color;
            if (color.id === Config.stone.color.white.id) {
                return new Color({
                    code: Config.stone.color.black.code,
                    id: Config.stone.color.black.id,
                });
            } else if (color.id === Config.stone.color.black.id) {
                return new Color({
                    code: Config.stone.color.white.code,
                    id: Config.stone.color.white.id,
                });
            } else return new Color({ code: '', id: 0 }); //nullにするとplayer.colorにもnullの型指定追加が必要なので一旦初期値にしてます。どこかでエラー処理を書いた方がいいかもしれないです。

            /* 修正予定コード
            const color: Color = this.players[Config.player.playerIndex].color;
            if (color.id === Config.stone.color.white.id){
                return Config.stone.color.black;
            }
            else if (color.id === Config.stone.color.black.id){
                return Config.stone.color.white;
            }
            else return {}; //nullにするとplayer.colorにもnullの型指定追加が必要なので一旦初期値にしてます。どこかでエラー処理を書いた方がいいかもしれないです。
            */
        },

        doValidation(): void {
            (this.$refs.form as any).validate();
        },

        checkValidationPlayerName(): boolean {
            const playerIndex: number = Config.player.playerIndex;
            const indexModePvC: number = Config.top.indexModePvC;
            if (
                this.selectedMode.modeName ===
                Config.top.modes[indexModePvC].modeName
            ) {
                return this.players[playerIndex].name === '';
            } else {
                for (let player in this.players) {
                    if (this.players[player].name === '') {
                        return true;
                    }
                }
                return false;
            }
        },

        checkValidationPlayerColor(): boolean {
            const playerIndex: number = Config.player.playerIndex;
            if (this.isPvCMode) {
                /*
                this.players[playerIndex].color.codeの指定の場合、this.players[playerIndex].colorはStoneになり直接アクセス不可
                this.players[playerIndex].color.color.codeの指定の場合、未選択時と選択時で動作が異なる
                未選択時：this.players[playerIndex].color.color.codeは
                選択時：this.players[playerIndex].color.color.codeでアクセスが出来なくなってしまう
                this.players[playerIndex].color.codeの指定だと先に進まなくなるため一旦仮で設定
                (this.players[playerIndex].colorだとColor未選択時でも次の画面に進める)
                */
                return this.players[playerIndex].color.code === '';
            } else {
                for (let player in this.players) {
                    if (this.players[player].color.code === '') {
                        return true;
                    }
                }
                return false;
            }
        },
    },

    computed: {
        isPvCMode(): boolean {
            const indexModePvC: number = Config.top.indexModePvC;
            return (
                this.selectedMode.modeName ===
                Config.top.modes[indexModePvC].modeName
            );
        },
        isPvPMode(): boolean {
            const indexModePvP: number = Config.top.indexModePvP;
            return (
                this.selectedMode.modeName ===
                Config.top.modes[indexModePvP].modeName
            );
        },
        //router-linkに飛んだあとに@clickが反応してしまうため、checkValidationを別に用意
        checkValidation(): boolean {
            return (
                this.selectedMode.modeName === '' ||
                this.checkValidationPlayerName() ||
                this.checkValidationPlayerColor()
            );
        },
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

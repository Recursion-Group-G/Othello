<template>
    <div class="fill-height pa-1">
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
                    :rules="modeRules"
                    required
                ></v-select>
                <!--Player-->
                <div v-if="isPvPMode">
                    <div v-for="(player, index) in players" :key="index">
                        <!--v-form確認中
                        <v-form
                            ref="form"
                            lazy-validation
                        > -->
                        <v-text-field
                            class="mt-10"
                            v-model="player.name"
                            :counter="nameCounter"
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
                        <!--v-form確認中
                        </v-form>
                        -->
                    </div>
                </div>
                <!--Modeの選択なし、PvCモードの時は一つの表示-->
                <div v-else>
                    <v-text-field
                        class="mt-10"
                        v-model="players[playerIndex].name"
                        :counter="nameCounter"
                        :label="`Name (Player${playerIndex + 1})`"
                        :rules="nameRules"
                        required
                    ></v-text-field>
                    <!--後ほどプレイヤー毎の選択により連動するselectに変更-->
                    <v-select
                        v-model="players[playerIndex].color"
                        item-text="name"
                        item-value="obj"
                        :items="colors"
                        :label="`Color (Player${playerIndex + 1})`"
                        :rules="colorRules"
                        required
                    ></v-select>
                </div>

                <!-- Game Start button -->
                <v-row class="d-flex justify-center mt-10 white--text">
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
import Color from '../models/stone';

export default Vue.extend({
    name: 'Login',
    data() {
        return {
            selectedMode: { modeString: '', modeName: '' },
            modes: Config.top.modes,

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

            cpuPlayerName: Config.player.cpuName,

            nameCounter: Config.top.nameCounter,

            playerIndex: Config.player.playerIndex,

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
            //(this.$refs.form as any).validate()
            //作成中のためコメントアウト
            const cpuIndex: number = Config.player.cpuIndex; //ConfigにCPUがどこになるのかIndex追加
            if (this.isPvCMode) {
                this.switchCpuPlayer(this.players[cpuIndex]);
            }
            this.$emit('playersData', this.players);
        },

        switchCpuPlayer(player: Player) {
            player.name = this.cpuPlayerName;
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
    },

    computed: {
        isPvCMode(): boolean {
            const cpuIndex: number = Config.player.cpuIndex;
            return (
                this.selectedMode.modeName ===
                Config.top.modes[cpuIndex].modeName
            );
        },
        isPvPMode(): boolean {
            const playerIndex: number = Config.player.playerIndex;
            return (
                this.selectedMode.modeName ===
                Config.top.modes[playerIndex].modeName
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

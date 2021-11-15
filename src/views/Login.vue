<template>
    <div class="fill-height pa-1">
        <v-row justify="center">
            <v-col cols="10" sm="6" md="4">
                <h1 class="page-title">Select Mode</h1>
                <!--Select Mode-->
                <v-form ref="form" lazy-validation>
                    <v-select
                        label="Game Mode"
                        class="mt-10"
                        v-model="selectedMode"
                        :items="modes"
                        :rules="modeRules"
                        return-object
                        required
                        @change="modeChanged($event)"

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
                            v-model="players[Config.player.playerIndex].name"
                            :counter="Config.nameCounter"
                            :label="`Name (Player${
                                Config.player.playerIndex + 1
                            })`"
                            :rules="nameRules"
                            required
                        ></v-text-field>
                        <v-select
                            v-model="players[Config.player.playerIndex].color"
                            :items="colors"
                            item-text="name"
                            item-value="obj"
                            :label="`Color (Player${
                                Config.player.playerIndex + 1
                            })`"
                            :rules="colorRules"
                            required
                        ></v-select>
                    </div>
                </v-form>
                <v-row class="d-flex justify-center mt-10 white--text" >
                        <v-btn color="deep-purple accent-3 white--text" @click="redirect">
                            Game Start
                        </v-btn>
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
            modes: Object.keys(Config.modes).map(mode => Config.modes[mode]),
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
                    v.length <= Config.player.validation.name.max ||
                    `Name must be less than ${Config.nameCounter} characters`,
                (v: any) =>
                    v.length >= Config.player.validation.name.min ||
                    `Name must be more than ${Config.nameCounter} characters`,
            ],
            colorRules: [(v: any) => !!v.code || 'Color is required'],
        };
    },

    methods: {
        sendPlayers() {
            const cpuIndex: number = Config.player.cpuIndex;
            this.$emit('playersData', this.players);
        },

        judgeCpuColor(): Color {
            const color: Color = this.players[Config.player.playerIndex].color;
            if (color.id === Config.stone.color.white.id) {
                return Config.stone.color.black;
            } else {
                return Config.stone.color.white;
            }
        },

        doValidation(): void {
            (this.$refs.form as any).validate();
        },

        checkValidationPlayerName(): boolean {
            const playerIndex: number = Config.player.playerIndex;
            const indexModePvC: number = Config.indexModePvC;
            if (
                this.selectedMode ===
                Config.modes.PvC
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
        redirect(): void {
            if (this.checkValidation()){
                this.sendPlayers()
                this.$router.push('/game');
            }
        },
        checkValidation(): boolean {
            return (
                this.selectedMode === '' ||
                this.checkValidationPlayerName() ||
                this.checkValidationPlayerColor()
            );
        },
        modeChanged(event: string): void{
            //cpuのカラーが被ってないかどうかは別の場所で判断するのでここで変更を加える必要はない。
            switch(event){
                case Config.modes.PvP:
                    this.players[Config.player.cpuIndex].name = ''
                    this.players[Config.player.cpuIndex].isCpu = false
                case Config.modes.PvC:
                    this.players[Config.player.cpuIndex].name = Config.Player.cpuName
                    this.players[Config.player.cpuIndex].isCpu = true
                default: return;
            }
        }
    },

    computed: {
        isPvCMode(): boolean {
            return this.selectedMode === Config.modes.PvC;
        },
        isPvPMode(): boolean {
            return this.selectedMode === Config.modes.PvP;
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

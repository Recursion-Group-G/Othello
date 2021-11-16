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
                        </div>
                    </div>
                    <!--Modeの選択なし、PvCモードの時は一つの表示-->
                    <div v-else>
                        <v-text-field
                            class="mt-10"
                            v-model="players[Config.player.playerIndex].name"
                            :counter="Config.nameCounter"
                            :label="`Name (Player${Config.player.playerIndex + 1})`"
                            :rules="nameRules"
                            required
                        ></v-text-field>
                    </div>

                    <div>
                        <v-radio-group v-model="firstPlayerIndex" @change="setPlayersColor($event)">
                             <p>First Player</p>
                            <v-radio
                                v-for="(player, index) in players"
                                :key="index"
                                :label="`Player${index+1}`"
                                :value="index"
                            ></v-radio>
                            <v-radio 
                                :label="`Random`"
                                :value="-1"
                            ></v-radio>

                        </v-radio-group>
                    </div>
                </v-form>
                <v-row class="d-flex justify-center mt-10 white--text">
                    <v-btn color="deep-purple accent-3 white--text" @click="redirect()">
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
            firstPlayerIndex: 0,
            modes: Object.keys(Config.modes).map((mode) => Config.modes[mode]),
            players: new Array(Config.player.number.min).fill({}).map(() => new Player()),
            modeRules: [(v: any) => !!v || 'Mode is required'],
            nameRules: [
                (v: any) => !!v || 'Name is required',
                (v: any) =>
                    v.length <= Config.player.validation.name.max ||
                    `Name must be less than ${Config.player.validation.name.max} characters`,
                (v: any) =>
                    v.length >= Config.player.validation.name.min ||
                    `Name must be more than ${Config.player.validation.name.min} characters`,
            ],
        };
    },

    methods: {
        setPlayerColor(index: number, color: Color){
            this.players[index].color = color;
        },
        setPlayersColor(event: number): void{
            const player : Player | null =  this.players[event]

            //二人しかいない場合が前提
            if(player === null){
                const ramdomIndex = Math.floor(Math.random() * this.players.length);
                this.setPlayersColor(ramdomIndex);
                return;
            }
            
            const otherPlayerIndex = (event + 1) %  this.players.length;

            this.setPlayerColor(event, Config.stone.color.black);
            this.setPlayerColor(otherPlayerIndex, Config.stone.color.white);

        },
        validate(): boolean {
            return (this.$refs.form as any).validate();
        },
        checkValidationPlayerName(): boolean {
            const playerIndex: number = Config.player.playerIndex;
            if (this.selectedMode === Config.modes.PvC) {
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
        checkValidation(): boolean {
            return (
                this.selectedMode === '' ||
                this.checkValidationPlayerName()
            );
        },
        redirect(): void {
            if (this.validate()) {
                this.sendPlayers();
                this.$router.push('/game');
            }
        },
        sendPlayers() {
            this.$emit('playersData', this.players);
        },
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

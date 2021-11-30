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
                        @change="modeChange($event)"
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
                </v-form>
                <v-row class="d-flex justify-center mt-10 white--text">
                    <v-btn color="deep-purple accent-3 white--text" @click="redirect()">
                        Game Start
                    </v-btn>
                </v-row>
            </v-col>
        </v-row>
        <!-- デバッグ用 -->
        <!-- <button @click="log()">logggg</button> -->
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
            modeRules: [(v: string) => !!v || 'Mode is required'],
            nameRules: [
                (v: string) => !!v || 'Name is required',
                (v: string) =>
                    v.length <= Config.player.validation.name.max ||
                    `Name must be less than ${Config.player.validation.name.max} characters`,
                (v: string) =>
                    v.length >= Config.player.validation.name.min ||
                    `Name must be more than ${Config.player.validation.name.min} characters`,
            ],
        };
    },

    methods: {
        log(): void {
            // console.log(this.players);
        },
        modeChange(event: string): void {
            const lastPlayer = this.players[this.players.length - 1];

            switch (event) {
                case Config.modes.PvP:
                    lastPlayer.isCpu = false;
                    return;
                case Config.modes.PvC:
                    lastPlayer.isCpu = true;
                    return;
                default:
                    return;
            }
        },
        shufflePlayers(): void {
            for (var i = this.players.length - 1; 0 < i; i--) {
                var r = Math.floor(Math.random() * (i + 1));

                var tmp = this.players[i];
                this.players[i] = this.players[r];
                this.players[r] = tmp;
            }
        },
        setPlayersColor(): void {
            //this.shufflePlayers(); //シャッフルすると最初にplayerのputStone()でcpuが動作しなくなるため
            const colorStrings: string[] = Object.keys(Config.stone.color);

            for (let i = 0; i < this.players.length; i++) {
                const player: Player = this.players[i];
                const colorString: string = colorStrings[i];
                const color: Color = Config.stone.color[colorString];

                player.color = color;
                if (player.name === '') player.name = Config.player.cpuName;
            }
        },
        validate(): boolean {
            return (this.$refs.form as Vue & { validate: () => boolean }).validate();
        },
        redirect(): void {
            this.setPlayersColor();
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

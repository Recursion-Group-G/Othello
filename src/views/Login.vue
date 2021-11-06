<template>
    <v-app>
        <v-content class="fill-height pa-1">
            <v-row justify="center">
                <v-col cols="10" sm="6" md="4">
                    <h1 class="page-title">Select Mode</h1>
                    <v-select :items="modes" label="Game Mode"></v-select>
                    <v-text-field
                        :counter="10"
                        label="Name（Player1）"
                        required
                    ></v-text-field>
                    <v-text-field
                        :counter="10"
                        label="Name（Player2）"
                        required
                    ></v-text-field>
                    <v-row class="d-flex">
                        <v-btn
                            class="button"
                            dark
                            large
                            color="deep-purple"
                            href="/#/game"
                            >Game Start</v-btn
                        >
                    </v-row>
                </v-col>
            </v-row>
        </v-content>
    </v-app>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'Login',
    data() {
        return {
            modes: ['Player VS Player', 'Player VS CPU'],
        };
    },
});
</script>

<style>
.page-title {
    text-align: center;
    margin-top: 120px;
    font-size: 40px;
}

.button {
    display: block;
    margin: 60px auto;
    width: 200px;
    height: 40px;
    background-color: #6558f5;
    color: #ffffff;
    font-size: 16px;
    border-radius: 10px;
}
</style>

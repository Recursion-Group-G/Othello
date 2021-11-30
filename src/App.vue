<template>
    <v-app>
        <v-main>
            <router-view
                @playersData="setPlayer"
                @update:tableData="setTable"
                :table.sync="this.table"
            ></router-view>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Table from './models/table';
import Player from './models/player';
export default Vue.extend({
    name: 'App',
    data() {
        return {
            table: {} as Table,
        };
    },
    methods: {
        setPlayer(players: Player[]) {
            this.table.players = players;
        },
        setTable(table: Table) {
            this.table = table;
        },
    },
    created: function () {
        this.table = new Table();
    },
});
</script>

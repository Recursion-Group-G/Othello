<template>
    <div class="size-fill d-flex justify-center align-center">
        <v-sheet
            class="mx-auto transition-swing rounded-circle stone-style pink lighten-4"
            elevation="12"
            color="#F8BBD0"
        ></v-sheet>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    data() {
        return {};
    },
});
</script>

<style scoped>
.size-fill {
    width: 100%;
    height: 100%;
}

.stone-style {
    width: 30%;
    height: 30%;
}
</style>

<template>
    <div class="size-fill d-flex justify-center align-center">
        <v-sheet
            class="mx-auto transition-swing rounded-circle stone-style"
            elevation="12"
            :color="stone.color.code"
        ></v-sheet>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Stone from '@/models/stone';
export default Vue.extend({
    props: {
        stone: Stone,
    },
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
    width: 90%;
    height: 90%;
}
</style>

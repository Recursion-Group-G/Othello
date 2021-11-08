<template>
    <div class="d-flex justify-center align-center vh-100">
        <div class="board-square">
            <canvas class="three"></canvas>
        </div>
    </div>
</template>

<style scoped>
.vh-100 {
    height: 100vh;
}

.board-square {
    width: 200px;
    height: 200px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;
    gap: 20px;
    border-radius: 0px;
    backdrop-filter: blur(9px);
    /* background-color: #09c15a; */
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 6px rgba(255, 255, 255, 0.4) solid;
    border-bottom: 6px rgba(40, 40, 40, 0.35) solid;
    border-right: 6px rgba(40, 40, 40, 0.35) solid;
}
</style>

<script>
import Vue from 'vue';
import FlipAnimation from '@/modules/flipAnimation';

export default Vue.extend({
    name: 'Stone',
    mounted: async function () {
        const animation = new FlipAnimation();
        await animation.flip();
        animation.remove();
    },
});
</script>

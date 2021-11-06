<template>
    <div>
        <div class="d-flex justify-center align-center vh-100">
            <div>
                <h1 class="top mb-10">Othello</h1>
                <div class="d-flex justify-center">
                    <v-btn
                        class="deep-purple accent-3 white--text"
                        depressed
                        elevation="24"
                        href="/#/login"
                    >
                        Start
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'Top',
});
</script>

<style scoped>
.vh-100 {
    height: 100vh;
}

/* Google fonts */
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.top {
    font-family: 'Lato';
    font-size: 100px;
}
</style>

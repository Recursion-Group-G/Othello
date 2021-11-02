<template>
    <div class="main-wrapper">
      <h1 class="page-title">Select Mode</h1>
      <div class="mode-select-wrapper">
        <select class="mode-select">
          <option>Player VS Player</option>
          <option>Player VS CPU</option>
        </select>
      </div>
      <div class="input-name-wrapper">
        <input type="text" class="input" placeholder="Player1 Name" />
        <input type="text" class="input" placeholder="Player2 Name" />
      </div>
      <button class="button">Game Start</button>
</template>


<script lang="ts">
import  Vue  from 'vue';

export default Vue.extend({
    name: "Login"
});
</script>

<style>
     .main-wrapper {
      width: 400px;
      margin: 0 auto;
    }

    .page-title {
      text-align: center;
      margin-top: 120px;
      font-size: 40px;
    }

    .mode-select-wrapper {
      width: 200px;
      margin: 20px auto;
    }

    .mode-select {
      height: 40px;
      width: 200px;
      margin: 20px auto;
      text-align: center;
    }

    .input-name-wrapper {
      display: flex;
      justify-content: space-between;
      text-align: center;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .input {
      height: 30px;
    }

    .button {
      display: block;
      margin: 40px auto;
      width: 200px;
      height: 40px;
      background-color: #6558f5;
      color: #ffffff;
      font-size: 16px;
      border-radius: 10px;
    }

    @media screen and (max-width: 480px) {
      /* 480px以下に適用されるCSS（スマホ用） */
      .main-wrapper {
        width: 100%;
      }

      .input-name-wrapper {
        width: 80%;
        margin: 20px auto;
      }

      .input {
        width: 45%;
      }

      .button {
        width: 80%;
      }
    }
</style>
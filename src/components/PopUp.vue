<template>
    <v-app>

        <v-btn v-on:click="openModal">Click</v-btn>

        <div id="popup" v-show="showContent">
            <v-card id="content" class="d-flex justify-center">
                <div>
                    <h2 class="text-center">XX is Winner</h2>

                    <div>
                        <v-btn
                            class="deep-purple accent-3 white--text"
                            elevation="24"
                        >
                            Top
                        </v-btn>
                        <v-btn
                            class="deep-purple accent-3 white--text"
                            elevation="24"
                        >
                            Retry
                        </v-btn>
                    </div>
                </div>
            </v-card>
        </div>

    </v-app>
</template>


<script>
export default {
    data: () => ({
        showContent: false,
    }),
    methods: {
        openModal: function(){
            this.showContent = true
        },
        closeModal: function(){
            this.showContent = false
        }
    }
};
</script>


<style>
#popup{
  /* 要素を重ねた時の順番 */
  z-index:1;

  /* 画面全体を覆う設定 */
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);

  /* 画面の中央に要素を表示させる設定 */
  display: flex;
  align-items: center;
  justify-content: center;
}

#content{
  z-index:2;
  width:250px;
  padding: 1em;
  background:#fff;
}

</style>
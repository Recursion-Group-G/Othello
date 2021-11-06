<template>
    <v-app>
        <button v-on:click="openModal">Click</button>

        <div id="popup" v-show="showContent">
            <v-card id="content">
                <v-card-title>XX is Winner</v-card-title>

                <v-card-actions>
                    <v-btn>Top</v-btn>
                    <v-btn>Retry?</v-btn>
                    <v-btn v-on:click="closeModal">Close</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </v-app>

</template>


<script>
export default {
    data: {
        showContent: false,
    },
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


<sytle>
#popup{
  /*　要素を重ねた時の順番　*/
  z-index:1;

  /*　画面全体を覆う設定　*/
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);

  /*　画面の中央に要素を表示させる設定　*/
  display: flex;
  align-items: center;
  justify-content: center;
}

#content{
  z-index:2;
  width:50%;
  padding: 1em;
  background:#fff;
}
</sytle>
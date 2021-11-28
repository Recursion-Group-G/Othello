<template>
    <div class="v-content">
        <v-container class="d-flex justify-center text-center mt-5">
            <!-- Players上部(スマホの時のみ表示) -->
            <h2 v-if="isXs" class="player-font">{{ table.players[1].name }}: {{ k.score }}</h2>
        </v-container>

        <v-container class="board">
            <v-row class="d-flex justify-center my-3">
                <!-- Board -->
                <div>
                    <div>
                        <!-- テスト表示 -->
                        <h2>{{ isGameFinished ? "Game Finished!!..." : "Play Othello!!"}}</h2>
                        <h2>Current Color: {{ this.currentPlayerColor }}</h2>
                    </div>
                    <div
                        v-for="(row, rowIndex) in table.board.squares"
                        :key="rowIndex"
                        class="d-flex"
                    >
                        <div v-for="(square, colIndex) in row" :key="colIndex">
                            <div
                                :id="`${square.point.x}-${square.point.y}`"
                                class="board-square"
                                @click="putStone(square)"
                                v-bind:class="square.isAllowedToPlace ? `square-markColor` : `square-basicColor`"
                            >
                                <StoneView :stone="square.stone" v-if="square.stone && square.stone.isVisible" />
                            </div>
                        </div>
                    </div>
                </div>
            </v-row>
        </v-container>

        <!-- Players下部 -->
        <v-container>
            <v-row v-if="!isXs" class="d-flex space-between text-center mb-5">
                <v-col v-for="k in table.players" :key="k.name">
                    <h2 class="player-font">{{ k.name }}: {{ k.score }}</h2>
                </v-col>
            </v-row>

            <v-row v-else class="d-flex space-between text-center mb-5">
                <v-col>
                    <h2 class="player-font">{{ table.players[0].name }}: {{ k.score }}</h2>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FlipAnimation from '@/modules/flipAnimation';
import router from '../router';
import Config from '../config';
import Table from '@/models/table';
import BoardBuilder from '../modules/boardBuilder';
import Board from '../models/board';
import StoneView from '@/components/Stone.vue';
import Stone from '../models/stone';
import Square from '@/models/square';
import Player from '@/models/player';
import EnclosureController from '@/modules/enclosureController';
import Direction from '@/interfaces/direction';
import AllowedDirections from '@/models/allowedDirections';
import Color from '@/interfaces/color'
import PlayerDicisions from '@/modules/playerDicisions'
import LocalStorage from '../modules/localStorage';

export default Vue.extend({
    name: 'Game',
    props: ['table'],
    components: {
        StoneView,
    },
    data: () => ({
        //仮のPlayer配列
        playerDicisions : [] as Square[],
        players: ['Player1', 'Player2'],
        currentPlayer: new Player() as Player,
        localStorageTable: {} as Table,
        flipCounter: 0 as number,
        isGameFinished: false as boolean,
    }),
    created: function () {
        // this.localStorageTable = LocalStorage.fetchTable();
        //今は画面遷移しないようにコメントアウト
        // this.validateLocalStorage();
        // this.validateTable();
        // LocalStorage.saveTable(this.table);
        // this.setTable(this.localStorageTable);
        let board = this.createBoard();
        this.setBoardOnTable(board);
        this.currentPlayer = this.table.players[0];
        this.initialGame();
    },
    computed: {
        //スマホの画面判定
        isXs() {
            return this.$vuetify.breakpoint.name === 'xs';
        },
        //プレイヤーターンの色テスト表示
        currentPlayerColor(): string {
            return this.currentPlayer.color.id === 0 ? 'Black' : 'White';
        },
    },
    methods: {
        validateTable: function (): void {
            //必要な情報がnullであればトップページへ画面遷移
            if (this.table == null || this.table.players == null || this.table.board == null)
                router.push('/');
        },
        getLocalStorage: function (): void {
            let jsonTable = localStorage.getItem(Config.localStorage.table);
            this.localStorageTable = jsonTable ? JSON.parse(jsonTable) : {};
            console.log(this.localStorageTable);
        },
        validateLocalStorage: function (): void {

            //locakStirageから取得したTableオブジェクトが空ではないが、playerかboardが空であればトップページへ遷移
            if (Object.keys(this.localStorageTable).length) {
                if (!this.localStorageTable.players || !this.localStorageTable.board)
                    router.push('/');
            }
        },
        saveLocalStorage: function (): void {
            let tableJsonDecoded = JSON.stringify(this.table);
            localStorage.setItem(Config.localStorage.table, tableJsonDecoded);
        },
        clearLocalStorage: function (): void {
            localStorage.clear();
        },
        setTable(table: Table) {
            this.$emit('update:tableData', table);
            // this.table = table
        },
        createBoard(): Board {
            let boardBuilder = new BoardBuilder();
            boardBuilder.setSize({
                x: Config.board.size.x,
                y: Config.board.size.y,
            });
            boardBuilder.createSquares();
            boardBuilder.linkSquaresNode();
            boardBuilder.setEnclosureController(new EnclosureController());
            return boardBuilder.build();
        },
        setBoardOnTable(board: Board): void {
            this.table.board = board;
        },
        initialGame(): void {
            //石を4個最初に置く
            console.log('start')
            this.table.board.squares[3][3].stone = new Stone(Config.stone.color.black);
            this.table.board.squares[4][4].stone = new Stone(Config.stone.color.black);
            this.table.board.squares[3][4].stone = new Stone(Config.stone.color.white);
            this.table.board.squares[4][3].stone = new Stone(Config.stone.color.white);
            //isEmptyをfalseに変更
            this.table.board.squares[3][3].isEmpty = false;
            this.table.board.squares[4][4].isEmpty = false;
            this.table.board.squares[3][4].isEmpty = false;
            this.table.board.squares[4][3].isEmpty = false;
            //初期のEnclosure追加
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[2][2]);
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[2][3]);
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[2][4]);
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[2][5]);
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[3][2]);
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[3][5]);
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[4][2]);
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[4][5]);
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[5][2]);
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[5][3]);
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[5][4]);
            this.table.board.enclosureController.addEnclosure(this.table.board.squares[5][5]);

            //EnclosureControllerの中で石が置ける場所を確認
            this.setPlayerDicisions(this.currentPlayer)
            console.log('stop');
        },
        setPlayerDicisions(player: Player){
            this.playerDicisions = new PlayerDicisions(
                player,
                this.table.board.enclosureController
            )
            .filterDicisions()
            .get()

            console.log('hey')
        },
        putStone: function (square: Square): void {
            //石が置ける場所をクリックした場合
            if (!square.isAllowedToPlace) return;

            square.stone = new Stone(this.currentPlayer.color);
            square.isAllowedToPlace = false;
            square.isEmpty = false;
            this.flipAllDirections(square);
            this.currentPlayer.score += 1;
            this.updateScore();
            this.table.turnCounter += 1;

            //Enclosureを更新
            this.table.board.enclosureController.updateFromSquare(square);

            this.turnChange();
        },
        flipAllDirections(square: Square): void {
            //Squareがひっくり返せる方向を取得
            for (let direction in square.allowedDirections) {
                if (square.allowedDirections[direction as keyof AllowedDirections]) {
                    this.flipOneDirection(square, direction as keyof Direction);
                }
            }
        },
        flipOneDirection(square: Square, direction: keyof Direction) {
            let iterator: Square | null = square[direction];
            //currentPlayerと違う色が続くまで石をひっくり返し続ける
            while (
                iterator !== null &&
                iterator.stone !== null &&
                iterator.stone.color.id !== this.currentPlayer.color.id
            ) {
                this.flipStone(iterator, this.currentPlayer.color);
                this.flipCounter += 1;
                iterator = iterator[direction];
            }
        },
        flipStone: async function (square: Square, toColor: Color): Promise<void> {
            if (square.stone === null) return;

            const stone = square.stone
            const fromColor = stone.color;

            stone.color = toColor
            stone.isVisible = false;

            const animation = new FlipAnimation(
                square.id,
                fromColor.code,
                toColor.code
            );

            animation.flip(()=>{
                stone.isVisible = true;
            });

        },
        turnChange: function (): void {
            let index = this.table.turnCounter % this.table.players.length;
            this.currentPlayer = this.table.players[index];

            this.setPlayerDicisions(this.currentPlayer);


            if(this.playerDicisions.length === 0 ){
                this.currentPlayer.isSkipped == true
                //CONSIDER: 急にスキップしちゃうから間を置いたり、ポップアップを出した方がいい。

                const isPlayerAllSkipped = this.table.players.reduce((bool : boolean, p:Player) => {
                    bool = p.isSkipped ? bool : false ;
                }, true);

                if( //プレイヤーが全員スキップした時 or Enclosure(stoneを置ける場所)がない時 ゲーム終了
                    isPlayerAllSkipped || 
                    this.table.board.enclosureController.head === null
                ) {
                    this.isGameFinished = true;
                }
                else {
                    this.turnChange()
                }
            }
        },
        updateScore: function (): void {
            const nextPlayerIndex = (this.table.turnCounter + 1) % this.table.players.length;
            const nextPlayer = this.table.players[nextPlayerIndex];
            this.currentPlayer.score += this.flipCounter;
            nextPlayer.score -= this.flipCounter;
            this.flipCounter = 0;
        },
    },
});
</script>

<style>
/* Google fonts */
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.v-content {
    background-color: #ffffff;
}

.board-square {
    width: 90px;
    height: 90px;

    cursor: pointer;
    transition: all 0.2s;
    gap: 20px;
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 6px rgba(255, 255, 255, 0.4) solid;
    border-bottom: 6px rgba(40, 40, 40, 0.35) solid;
    border-right: 6px rgba(40, 40, 40, 0.35) solid;

    position: relative;
}

.square-basicColor{
    background-color: #09c15a;
}

.square-markColor{
    background-color: #ffd700;
}

/* テスト用に一旦コメントアウト */
/* .board-square:hover {
    opacity: 0.2;
    background: #000000;
} */

.player-font {
    font-family: 'Lato';
    font-size: 40px;
}

@media screen and (max-width: 480px) {
    /* 480px以下に適用されるCSS（スマホ用） */
    .board {
        width: 100%;
    }

    .board-square {
        width: 50px;
        height: 50px;
        color: #ffffff;
        cursor: pointer;
        transition: all 0.2s;
        gap: 20px;
        border-radius: 0px;
        backdrop-filter: blur(9px);
        background-color: #09c15a;
        box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
        border: 3.36px rgba(255, 255, 255, 0.4) solid;
        border-bottom: 3.36px rgba(40, 40, 40, 0.35) solid;
        border-right: 3.36px rgba(40, 40, 40, 0.35) solid;
    }
}
</style>

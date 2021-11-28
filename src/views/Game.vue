<template>
    <div class="v-content">
        <v-container class="d-flex justify-center text-center mt-5">
            <!-- Players上部(スマホの時のみ表示) -->
            <!-- Playerの配列は仮、プレイヤーの枚数"2"は後でプレイヤーの配列や点数の状態で書き換え -->
            <h2 v-if="isXs" class="player-font">{{ players[1] }}: 2</h2>
        </v-container>

        <v-container class="board">
            <v-row class="d-flex justify-center my-3">
                <!-- Board -->
                <div>
                    <div>
                        <!-- テスト表示 -->
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
                            >
                                <StoneView :stone="square.stone" v-if="square.stone" />
                            </div>
                        </div>
                    </div>
                </div>
            </v-row>
        </v-container>

        <!-- Players下部 -->
        <v-container>
            <v-row v-if="!isXs" class="d-flex space-between text-center mb-5">
                <!-- Playerの配列は仮、プレイヤーの枚数"2"は後で点数の状態で書き換え -->
                <v-col v-for="k in players" :key="k">
                    <h2 class="player-font">{{ k }}: 2</h2>
                </v-col>
            </v-row>

            <v-row v-else class="d-flex space-between text-center mb-5">
                <v-col>
                    <h2 class="player-font">{{ players[0] }}: 2</h2>
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
import CheckAllowedSquares from '@/modules/checkAllowedSquares';
import Direction from '@/interfaces/direction';
import AllowedDirections from '@/models/allowedDirections';
import Color from '@/interfaces/color'
import PlayerDicisions from '@/modules/playerDicisions'

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
    }),
    created: function () {
        this.getLocalStorage();
        //今は画面遷移しないようにコメントアウト
        // this.validateLocalStorage();
        // this.validateTable();
        this.saveLocalStorage();
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
            ).filterDicisions().get()
        },
        putStone: function (square: Square): void {
            //石が置ける場所をクリックした場合
            if (square.isAllowedToPlace) {
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
            }
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

            const animation = new FlipAnimation(
                `${square.point.x}-${square.point.y}`,
                square.stone.color.code,
                this.currentPlayer.color.code
            );

            const stone = square.stone
            square.stone = null
            await animation.flip();
            animation.remove();
            square.stone = stone

            square.stone.color = toColor
        },
        turnChange: function (): void {
            let index = this.table.turnCounter % this.table.players.length;
            this.currentPlayer = this.table.players[index];

            this.setPlayerDicisions(this.currentPlayer);

            if(this.playerDicisions.length === 0 ){
                this.currentPlayer.isSkipped == true
                //CONSIDER: 急にスキップしちゃうから間を置いたり、ポップアップを出した方がいい。
                this.turnChange()
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
    background-color: #09c15a;
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 6px rgba(255, 255, 255, 0.4) solid;
    border-bottom: 6px rgba(40, 40, 40, 0.35) solid;
    border-right: 6px rgba(40, 40, 40, 0.35) solid;

    position: relative;
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

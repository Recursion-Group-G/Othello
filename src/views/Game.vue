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
                    <!-- 現在のプレイヤーの色テスト表示 -->
                    <div>
                        <h2>Current Color: {{ this.currentPlayerColor }}</h2>
                    </div>
                    <!-- PopUp test-->
                    <div>
                        <v-btn
                            tile
                            @click="isFinished = true"
                            color="deep-purple accent-3 white--text"
                            > PopUP test </v-btn>
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
                                <Point v-if="square.isAllowedToPlace" />
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
        <PopUp :table="this.table" @resetIsFinished="isFinished = false" v-if="isGameFinished" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router';
import Config from '../config';
import Table from '@/models/table';
import Board from '../models/board';
import Stone from '../models/stone';
import Square from '@/models/square';
import Player from '@/models/player';
import AllowedDirections from '@/models/allowedDirections';
import Enclosure from '@/models/enclosure';

import FlipAnimation from '@/modules/flipAnimation';
import BoardBuilder from '../modules/boardBuilder';
import EnclosureController from '@/modules/enclosureController';
import CheckAllowedSquares from '@/modules/checkAllowedSquares';
import LocalStorage from '@/modules/localStorage';

import Direction from '@/interfaces/direction';

import PopUp from '../components/PopUp.vue';
import StoneView from '@/components/Stone.vue';
//仮
import Point from '@/components/Point.vue';

// import func from 'vue-temp/vue-editor-bridge';

export default Vue.extend({
    name: 'Game',
    props: ['table'],
    components: {
        StoneView,
        PopUp,
        Point,
    },
    data: () => ({
        //仮のPlayer配列
        players: ['Player1', 'Player2'],
        currentPlayer: new Player() as Player,
        localStorageTable: {} as Table,
        flipCounter: 0 as number,
        //test
        isFinished: false,
    }),
    created: function () {
        this.localStorageTable = LocalStorage.fetchTable();
        //今は画面遷移しないようにコメントアウト
        // this.validateLocalStorage();
        // this.validateTable();
        LocalStorage.saveTable(this.table);
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
        isGameFinished(): boolean {
            return this.isFinished;
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
            this.table.board.squares[3][3].stone = new Stone(Config.stone.color.black);
            this.table.board.squares[4][4].stone = new Stone(Config.stone.color.black);
            this.table.board.squares[3][4].stone = new Stone(Config.stone.color.white);
            this.table.board.squares[4][3].stone = new Stone(Config.stone.color.white);
            //isEmptyをtrueに変更
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
            CheckAllowedSquares.searchAllowedSquares(
                this.currentPlayer,
                this.table.board.enclosureController
            );
            console.log('stop');
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
                this.table.board.enclosureController.addEnclosures(square);

                this.turnChange();
            }
        },
        flipAllDirections(square: Square): void {
            //Squareがひっくり返せる方向を取得
            if (square.allowedDirections === undefined) return; //エラー回避
            let directionCache: AllowedDirections = square.allowedDirections;

            for (let direction in directionCache.allDirections) {
                if (directionCache.allDirections[direction]) {
                    this.flipOneDirection(square, direction as keyof Direction);
                }
            }
        },
        isTherePlaceToPlace(enclosureController: EnclosureController): boolean {
            let iterator: Enclosure | null = enclosureController.head;
            while (iterator != null) {
                if (iterator.data?.allowedDirections !== undefined) {
                    return true;
                }
                iterator = iterator.next;
            }
            return false;
        },
        flipOneDirection(square: Square, direction: keyof Direction) {
            let iterator: Square | null = square[direction];
            //currentPlayerと違う色が続くまで石をひっくり返し続ける
            while (
                iterator !== null &&
                iterator.stone !== null &&
                iterator.stone.color.id !== this.currentPlayer.color.id
            ) {
                this.flipStoneAnimation(iterator);
                iterator.stone.color = this.currentPlayer.color;
                this.flipCounter += 1;
                iterator = iterator[direction];
            }
        },

        flipStoneAnimation: async function (square: Square): Promise<void> {
            //石をひっくり返すアニメーション
            if (square.stone === null) return;
            const animation = new FlipAnimation(
                `${square.point.x}-${square.point.y}`,
                square.stone.color.code,
                this.currentPlayer.color.code
            );
            await animation.flip(); //ひっくり返るのを待つ時はawaitつけて、待つ必要なしの場合はつけないでOK
            animation.remove();
        },
        turnChange: function (): void {
            let index = this.table.turnCounter % this.table.players.length;
            this.currentPlayer = this.table.players[index];
            //this.dicitions = this.enclosureController.getPlayersDicisions(this.currentPlayer)//未作成のメソッド//プレイヤーが置ける場所のみを配列か連結リストかで返す。
            //あとはプレイヤーが置ける場所を変えたり
            //そこにあるもの以外を置けなくしたりする
            //turnChange内に書くのではなくputStoneから呼び出す？

            //プレイヤーの置ける場所を確認
            CheckAllowedSquares.resetAfterTurnOver(this.table.board.enclosureController);
            CheckAllowedSquares.searchAllowedSquares(
                this.currentPlayer,
                this.table.board.enclosureController
            );

            //今のプレイヤーが置ける場所がなかったら、スキップ
            if (!this.isTherePlaceToPlace(this.table.board.enclosureController)) {
                this.currentPlayer.isSkipped = true;
                this.table.turnCounter += 1;

                //プレイヤー全員がスキップしてたらゲーム終了
                const skippedPlayers = this.table.players.filter(
                    (p: Player) => p.isSkipped === true
                );
                const isFullToPlace = this.table.board.enclosureController.head == null;
                const isScoreZero =
                    this.table.players[0].score === 0 || this.table.players[1].score === 0;
                if (
                    skippedPlayers.length === this.table.players.length ||
                    isFullToPlace ||
                    isScoreZero
                ) {
                    this.isFinished = true;
                    return;
                }

                this.turnChange();
            } else {
                //そのプレイヤーがプレイできたら全員リセット
                this.table.players.forEach((p: Player) => (p.isSkipped = false));
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

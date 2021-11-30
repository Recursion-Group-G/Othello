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
                        <!-- テスト表示 -->
                        <h2>{{ isGameFinished ? 'Game Finished!!...' : 'Play Othello!!' }}</h2>
                        <h2>Current Color: {{ this.currentPlayerColor }}</h2>
                    </div>
                    <!-- PopUp test-->
                    <div>
                        <v-btn
                            tile
                            @click="isGameFinished = true"
                            color="deep-purple accent-3 white--text"
                        >
                            PopUP test
                        </v-btn>
                    </div>

                    <div
                        v-for="(row, rowIndex) in table.board.squares"
                        :key="rowIndex"
                        class="d-flex"
                    >
                        <div v-for="(square, colIndex) in row" :key="colIndex">
                            <div
                                :id="square.id"
                                class="board-square square-basicColor"
                                @click="putStone(square)"
                            >
                                <StoneView
                                    :stone="square.stone"
                                    v-if="square.stone && square.stone.isVisible"
                                />
                                <Mark v-if="square.isAllowedToPlace" />
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
        <PopUp :table="this.table" @resetGame="resetGame" v-if="isGameFinished" />
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
import PlayerDecisions from '@/modules/playerDecisions';

import Direction from '@/interfaces/direction';
import PopUp from '../components/PopUp.vue';
import StoneView from '@/components/Stone.vue';
import Mark from '@/components/Mark.vue';
import Color from '@/interfaces/color';

export default Vue.extend({
    name: 'Game',
    props: ['table'],
    components: {
        StoneView,
        PopUp,
        Mark,
    },
    data: () => ({
        //仮のPlayer配列
        playerDecisions: [] as Square[],
        players: ['Player1', 'Player2'],
        currentPlayer: new Player() as Player,
        localStorageTable: {} as Table,
        flipCounter: 0 as number,
        isGameFinished: false as boolean,
        holdTime: false as boolean,
    }),
    created: function () {
        // localStorageへの保存は見直す必要があるため一度コメントアウト
        // this.localStorageTable = LocalStorage.fetchTable();
        // this.validateLocalStorage();
        // LocalStorage.saveTable(this.table);
        // this.setTable(this.localStorageTable);

        let board = this.createBoard();
        this.setBoardOnTable(board);
        this.validateTable();
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
            console.log('start initializing game');
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
            this.setPlayerDecisions(this.currentPlayer);
            console.log('end initilizing game');
        },
        setPlayerDecisions(player: Player) {
            this.playerDecisions = new PlayerDecisions(player, this.table.board.enclosureController)
                .filterDicisions()
                .get();
        },
        putStone: function (square: Square): void {
            if(this.holdTime) return;
            //石が置ける場所をクリックした場合
            if (!square.isAllowedToPlace) return;

            square.stone = new Stone(this.currentPlayer.color);
            square.isAllowedToPlace = false;
            square.isEmpty = false;
            this.flipAllDirections(square);
            this.currentPlayer.score += 1;
            this.updateScore();

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

            const stone = square.stone;
            const fromColor = stone.color;

            stone.color = toColor;
            stone.isVisible = false;

            const animation = new FlipAnimation(square.id, fromColor.code, toColor.code);

            animation.flip(() => {
                stone.isVisible = true;
            });
        },
        turnChange: function (): void {
            this.table.turnCounter += 1;
            let index = this.table.turnCounter % this.table.players.length;
            this.currentPlayer = this.table.players[index];

            this.setPlayerDecisions(this.currentPlayer);

            if (this.playerDecisions.length === 0) {
                this.currentPlayer.isSkipped = true;

                const isPlayerAllSkipped = this.table.players.reduce((bool: boolean, p: Player) => {
                    bool = p.isSkipped ? bool : false;
                    return bool;
                }, true);
                const isNoWhereToPlace = this.table.board.enclosureController.head == null;

                if (
                    //プレイヤーが全員スキップした時 or Enclosure(stoneを置ける場所)がない時 ゲーム終了
                    isNoWhereToPlace ||
                    isPlayerAllSkipped
                ) {
                    //1秒待ってゲーム終了(石のアニメーションの時間)
                    window.setTimeout(() => {
                        this.isGameFinished = true;
                    }, 1000);
                    return;
                } else {
                    //1秒待ってスキップ
                    window.setTimeout(() => {
                        alert('skipped');
                        this.turnChange();
                    }, 1000);
                    return;
                }
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

        resetGame(isRedirectedTop: boolean): void {
            this.isGameFinished = false;
            this.table.board.size = { x: 0, y: 0 };
            this.table.board.squares = [];
            this.table.board.enclosureController = new EnclosureController();
            this.table.turnCounter = 0;

            this.table.players.forEach((p: Player) => {
                p.score = Config.player.initialScore;
            });

            //Topに遷移した時はプレイヤーの名前をリセット(初期値null)
            if (isRedirectedTop) {
                this.table.players = null;
                return;
            }

            //createdの処理と重複しているで後ほど整理
            let board = this.createBoard();
            this.setBoardOnTable(board);
            this.currentPlayer = this.table.players[0];
            this.initialGame();
        },
        cpuAlgorithm: function (): void {
            this.holdTime = false;
            if(!this.currentPlayer.isCpu) return;
            const allowedSquares = this.table
                                       .board
                                       .enclosureController
                                       .fetchAllowedPlaceSquares();
            const randomIndex = Math.floor(Math.random() * allowedSquares.length);
            const cpuSquare = allowedSquares[randomIndex];
            this.putStone(cpuSquare);
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

.square-basicColor {
    background-color: #09c15a;
}

.square-markColor {
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

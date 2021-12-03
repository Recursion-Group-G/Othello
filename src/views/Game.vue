<template>
    <div class="v-content game">
        <v-container class="d-flex justify-center text-center">
            <!-- Players上部(スマホの時のみ表示) -->
            <h2
                v-if="isXs"
                v-bind:class="
                    table.players[1] == currentPlayer
                        ? `player-font-turn`
                        : `player-font-turn-waiting`
                "
            >
                {{ table.players[1].name }}: {{ table.players[1].score }}
            </h2>
        </v-container>

        <v-container class="board">
            <v-row class="d-flex justify-center">
                <!-- Board -->
                <div>
                    <!-- 現在のプレイヤーの色テスト表示 -->
                    <div>
                        <!-- テスト表示 -->
                        <h2>{{ isGameFinished ? 'Game Finished!!...' : 'Play Othello!!' }}</h2>
                        <div class="d-flex justify-start">
                            <h2>Current Color:</h2>

                            <v-sheet
                                v-if="currentPlayer.color.id === 0"
                                class="ml-2 rounded-circle"
                                elevation="12"
                                height="30"
                                width="30"
                                color="#000000"
                            ></v-sheet>

                            <v-sheet
                                v-else
                                class="ml-2 rounded-circle"
                                elevation="12"
                                height="30"
                                width="30"
                                color="#FFFFFF"
                            ></v-sheet>
                        </div>
                    </div>
                    <!-- For debug: PopUp test
                    <div>
                        <v-btn
                            tile
                            @click="isGameFinished = true"
                            color="deep-purple accent-3 white--text"
                        >
                            PopUP test
                        </v-btn>
                    </div>
                    -->
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
                                <Mark
                                    v-if="square.isAllowedToPlace && !holdTime && !holdTimeForCpu"
                                />
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
                    <h2
                        v-bind:class="
                            k == currentPlayer ? `player-font-turn` : `player-font-turn-waiting`
                        "
                    >
                        {{ k.name }}: {{ k.score }}
                    </h2>
                </v-col>
            </v-row>

            <v-row v-else class="d-flex space-between text-center mb-5">
                <v-col>
                    <h2
                        v-bind:class="
                            table.players[0] == currentPlayer
                                ? `player-font-turn`
                                : `player-font-turn-waiting`
                        "
                    >
                        {{ table.players[0].name }}: {{ table.players[0].score }}
                    </h2>
                </v-col>
            </v-row>
        </v-container>
        <PopUp :table="this.table" @resetGame="resetGame" v-if="isGameFinished" />
        <SkipDialog :skipDialog="skipDialog" :player="currentPlayer" />
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

import FlipAnimation from '@/modules/flipAnimation';
import BoardBuilder from '../modules/boardBuilder';
import EnclosureController from '@/modules/enclosureController';
import PlayerDecisions from '@/modules/playerDecisions';

import Direction from '@/interfaces/direction';
import Color from '@/interfaces/color';

import PopUp from '../components/PopUp.vue';
import StoneView from '@/components/Stone.vue';
import Mark from '@/components/Mark.vue';
import SkipDialog from '@/components/SkipDialog.vue';

const env = process.env.NODE_ENV;

export default Vue.extend({
    name: 'Game',
    props: ['table'],
    components: {
        SkipDialog,
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
        holdTimeForCpu: false as boolean,
        skipDialog: false as boolean,
    }),
    created() {
        // localStorageへの保存は見直す必要があるため一度コメントアウト
        // this.localStorageTable = LocalStorage.fetchTable();
        // this.validateLocalStorage();
        // LocalStorage.saveTable(this.table);
        // this.setTable(this.localStorageTable);
        this.setBoardOnTable(this.createBoard());
        this.validateTable();
        this.currentPlayer = this.table.players[0];
        this.initializeGame();
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
        /***************************
         * LocalStorage
         ***************************/
        saveLocalStorage(): void {
            let tableJsonDecoded = JSON.stringify(this.table);
            localStorage.setItem(Config.localStorage.table, tableJsonDecoded);
        },
        clearLocalStorage(): void {
            localStorage.clear();
        },
        getLocalStorage(): void {
            let jsonTable = localStorage.getItem(Config.localStorage.table);
            this.localStorageTable = jsonTable ? JSON.parse(jsonTable) : {};
            console.log(this.localStorageTable);
        },
        /***************************
         * Getters
         ***************************/
        createBoard(): Board {
            return new BoardBuilder()
                .setSize({
                    x: Config.board.size.x,
                    y: Config.board.size.y,
                })
                .createSquares()
                .linkSquaresNode()
                .setEnclosureController(new EnclosureController())
                .build();
        },
        /***************************
         * Setters
         ***************************/
        setBoardOnTable(board: Board): void {
            this.table.board = board;
        },
        setTable(table: Table) {
            this.$emit('update:tableData', table);
            // this.table = table
        },
        setPlayerDecisions(player: Player) {
            this.playerDecisions = new PlayerDecisions(player, this.table.board.enclosureController)
                .filterDicisions()
                .get();
        },
        updateScore(): void {
            const nextPlayerIndex = (this.table.turnCounter + 1) % this.table.players.length;
            const nextPlayer = this.table.players[nextPlayerIndex];
            this.currentPlayer.score += this.flipCounter;
            nextPlayer.score -= this.flipCounter;
            this.flipCounter = 0;
        },
        /***************************
         * Validators
         ***************************/
        validateTable(): void {
            //必要な情報がnullであればトップページへ画面遷移
            if (this.table == null || this.table.players == null || this.table.board == null)
                router.push('/');
        },

        validateLocalStorage(): void {
            //locakStirageから取得したTableオブジェクトが空ではないが、playerかboardが空であればトップページへ遷移
            if (Object.keys(this.localStorageTable).length) {
                if (!this.localStorageTable.players || !this.localStorageTable.board)
                    router.push('/');
            }
        },
        /***************************
         * Flip Func
         ***************************/
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
        flipAllDirections(square: Square): void {
            //Squareがひっくり返せる方向を取得
            for (let direction in square.allowedDirections) {
                if (square.allowedDirections[direction as keyof AllowedDirections]) {
                    this.flipOneDirection(square, direction as keyof Direction);
                }
            }
        },
        async flipStone(square: Square, toColor: Color): Promise<void> {
            if (square.stone === null) return;

            const stone = square.stone;
            const fromColor = stone.color;

            stone.color = toColor;
            stone.isVisible = false;

            const animation = new FlipAnimation(square.id, fromColor.code, toColor.code);

            this.holdTime = true;
            animation.flip(() => {
                stone.isVisible = true;
                this.holdTime = false;
            });
        },
        /***************************
         * Core Func
         ***************************/
        initializeGame(): void {
            //石を4個最初に置く
            console.log('start initializing game');

            const whites = [
                [3, 3],
                [4, 4],
            ];

            const blacks = [
                [3, 4],
                [4, 3],
            ];

            const initilizeStone = (cordinates: number[][], color: Color) => {
                for (let i = 0; i < cordinates.length; i++) {
                    const cordinate = cordinates[i];
                    const y = cordinate[0];
                    const x = cordinate[1];
                    const square = this.table.board.squares[y][x];

                    square.stone = new Stone(color);
                    square.isEmpty = false;
                    this.table.board.enclosureController.updateFromSquare(square);
                }
            };

            initilizeStone(whites, Config.stone.color.white);
            initilizeStone(blacks, Config.stone.color.black);

            //EnclosureControllerの中で石が置ける場所を確認
            this.setPlayerDecisions(this.currentPlayer);
            console.log('end initilizing game');
        },
        putStone(square: Square): void {
            //石が置ける場所をクリックした場合
            if (
                //developmentの時は置ける
                (env !== 'development' && !square.isAllowedToPlace) ||
                this.holdTime ||
                this.holdTimeForCpu
            )
                return;

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
        turnChange(): void {
            this.table.turnCounter += 1;
            let index = this.table.turnCounter % this.table.players.length;
            this.currentPlayer = this.table.players[index];

            this.setPlayerDecisions(this.currentPlayer);
            this.continueGame();
        },
        continueGame(): void {
            //そのcurrentPlauerがプレイできたら...
            if (this.playerDecisions.length !== 0) {
                this.table.players.forEach((p: Player) => (p.isSkipped = false));
                if (this.currentPlayer.isCpu) {
                    this.cpuAlgorithm();
                    return;
                } else {
                    return;
                }
            }
            //そのcurrentPlauerがプレイできない場合は...
            this.currentPlayer.isSkipped = true;

            const isNoWhereToPlace = this.table.board.enclosureController.head == null;
            const isPlayerAllSkipped = this.table.players.reduce((bool: boolean, p: Player) => {
                bool = p.isSkipped ? bool : false;
                return bool;
            }, true);

            //プレイヤーが全員スキップした時 or Enclosure(stoneを置ける場所)がない時 ゲーム終了
            if (isNoWhereToPlace || isPlayerAllSkipped) {
                //1秒待ってゲーム終了(石のアニメーションの時間)
                window.setTimeout(this.endGame, 1000);
                return;
            } else {
                // FIX: 非同期処理に同じ変数を扱うのは副作用の原因になるのでできれば分けた方がいい
                //3秒待ってスキップ
                this.skipDialog = true;
                this.holdTime = true;
                window.setTimeout(() => {
                    this.skipDialog = false;
                    this.holdTime = false;
                    this.turnChange();
                }, 3000);
                return;
            }
        },
        endGame(): void {
            this.isGameFinished = true;
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
            this.initializeGame();
        },
        cpuAlgorithm: function (): void {
            if (!this.currentPlayer.isCpu) return;
            const randomIndex = Math.floor(Math.random() * this.playerDecisions.length);
            const cpuSquare = this.playerDecisions[randomIndex];
            console.log(cpuSquare);

            this.holdTimeForCpu = true;
            window.setTimeout(() => {
                this.holdTimeForCpu = false;
                this.putStone(cpuSquare);
            }, 2000);
        },
    },
});
</script>

<style>
/* Google fonts */
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.game {
    font-family: 'Lato';
}

.v-content {
    background-color: #ffffff;
}

.board-square {
    width: 75px;
    height: 75px;

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

.player-font-turn {
    font-family: 'Lato';
    font-size: 40px;
}

.player-font-turn-waiting {
    font-family: 'Lato';
    font-size: 40px;
    color: #c0c0c0;
}

@media screen and (max-width: 480px) {
    /* 480px以下に適用されるCSS（スマホ用） */
    .board {
        width: 100%;
    }

    .board-square {
        width: 45px;
        height: 45px;
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

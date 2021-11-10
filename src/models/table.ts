import Player from './player';
import Board from './board';
import Config from '../config';

class Table {
    players: Player[];
    turnCounter: number;
    phase: number;
    board: Board;

    constructor(players: Player[], board: Board) {
        this.players = players;
        this.turnCounter = 0;
        this.phase = Config.table.phase.thinking;
        this.board = board;
    }
}

export default Table;

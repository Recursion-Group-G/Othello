import Player from './player';
import Board from './board';
import Config from '../config';

class Table {
    players: Player[] | null;
    turnCounter: number;
    phase: number;
    board: Board | null;

    constructor() {
        this.players = null;
        this.turnCounter = 0;
        this.phase = Config.table.phase.thinking;
        this.board = null;
    }
}

export default Table;

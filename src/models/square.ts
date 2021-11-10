import Stone from './stone';

class Square {
    row: number
    col: number
    stone: Stone | null;
    isEmpty: boolean;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
        this.stone = null;
        this.isEmpty = false;
    }
}

export default Square;
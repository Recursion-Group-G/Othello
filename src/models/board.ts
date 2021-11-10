import Square from './square';
interface Size {
    x: number;
    y: number;
}

class Board {
    size: Size;
    squares: Square[][];

    constructor(size: Size, squares: Square[][]) {
        this.size = size;
        this.squares = squares;
    }
}

export default Board;

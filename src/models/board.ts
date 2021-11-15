import Square from './square';
import Size from '../interfaces/size';

class Board {
    size: Size;
    squares: Square[][];

    constructor(size: Size, squares: Square[][]) {
        this.size = size;
        this.squares = squares;
    }
}

export default Board;

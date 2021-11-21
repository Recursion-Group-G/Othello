import Square from './square';
import Size from '../interfaces/size';
import EnclosureController from './src/modules/enclosureController';

class Board {
    size: Size;
    squares: Square[][];
    enclosureController: EnclosureController;

    constructor(size: Size, squares: Square[][], enclosureController: EnclosureController) {
        this.size = size;
        this.squares = squares;
        this.enclosureController = enclosureController;
    }
}

export default Board;

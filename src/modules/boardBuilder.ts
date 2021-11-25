import Square from '../models/square';
import Board from '../models/board';
import EnclosureController from './enclosureController';
import Size from '../interfaces/size';

class BoardBuilder {
    private size: Size;
    private squares: Square[][];
    private enclosureController: EnclosureController | null ;

    public constructor() {
        this.size = { x: 0, y: 0 };
        this.squares = [];
        this.enclosureController = null;
    }

    public setSize(size: Size): BoardBuilder {
        this.size = size;
        return this;
    }

    public setSquares(squares: Square[][]): BoardBuilder {
        this.squares = squares;
        return this;
    }

    public setEnclosureController(enclosureController: EnclosureController): BoardBuilder{
        this.enclosureController = enclosureController;
        return this;
    }

    public createSquares(): BoardBuilder {
        /**  squares[y][x] -> (x,y)
         *   (0,0)
         *   *____________
         *   |__|__|__|__|
         *   |__|__|__|__|
         *   |__|__|__|__|
         *   |__|__|__|__|
         *   |__|__|__|__|
         *                *
         *               (max,max)
         */

        const squares: Square[][] = [];

        const indexOutOfX: number = this.size.x - 1;
        const indexOutOfY: number = this.size.y - 1;

        for (let y = 0; y <= indexOutOfY; y++) {
            const squareX: Square[] = [];
            for (let x = 0; x <= indexOutOfX; x++) {
                squareX.push(new Square({ x: x, y: y }));
            }
            squares.push(squareX);
        }

        this.setSquares(squares);
        return this;
    }

    public linkSquaresNode(): BoardBuilder {
        const indexOutOfX: number = this.size.x - 1;
        const indexOutOfY: number = this.size.y - 1;

        for (let y = 0; y <= indexOutOfY; y++) {
            for (let x = 0; x <= indexOutOfX; x++) {
                const curr: Square = this.squares[y][x];

                //currから見た方向
                const top: number = y - 1;
                const right: number = x + 1;
                const left: number = x - 1;
                const bottom: number = y + 1;

                //縦横4方向の連結
                if (y > 0) curr.top = this.squares[top][x];
                if (x < indexOutOfX) curr.right = this.squares[y][right];
                if (y < indexOutOfY) curr.bottom = this.squares[bottom][x];
                if (x > 0) curr.left = this.squares[y][left];

                //斜め4方向の連結
                if (x < indexOutOfX && y > 0) {
                    curr.topRight = this.squares[top][right];
                }
                if (x > 0 && y > 0) {
                    curr.topLeft = this.squares[top][left];
                }
                if (x < indexOutOfX && y < indexOutOfY) {
                    curr.bottomRight = this.squares[bottom][right];
                }
                if (x > 0 && y < indexOutOfY) {
                    curr.bottomLeft = this.squares[bottom][left];
                }
            }
        }
        return this;
    }

    public build(): Board {
        return new Board(this.size, this.squares, this.enclosureController);
    }

    public reset(): BoardBuilder {
        this.size = { x: 0, y: 0 };
        this.squares = [];
        this.enclosureController = null;
        return this;
    }
}

export default BoardBuilder;

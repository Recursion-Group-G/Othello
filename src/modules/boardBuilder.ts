import Square from "../models/square";
import Board from "../models/board";
interface Size {
    x: number;
    y: number;
}

class BoardBuilder {
    private size: Size;
    private squares: Square[][];

    constructor() {
        this.size = {x: 0, y: 0};
        this.squares = [];
    }

    public setSize(size: Size): BoardBuilder {
        this.size = size;
        return this;
    }

    public setSquares(squares: Square[][]): BoardBuilder {
        this.squares = squares;
        return this;
    }

    public createSquares(): BoardBuilder {
        let squares : Square[][] = [];
        for(let y : number = 0; y < this.size.y; y++){
            let squareX : Square[] = [];
            for(let x : number = 0; x < this.size.x; x++){
                squareX.push(new Square({x: x, y: y}));
            }
            squares.push(squareX);
        }

        this.setSquares(squares);
        return this;
    }

    public linkSquaresNode(): BoardBuilder {
        for(let y : number = 0; y < this.size.y; y++){
            for(let x : number = 0; x < this.size.x; x++){
                let curr : Square = this.squares[y][x];
                
                const canInsertTop = y > 0;
                const canInsertRight = x < this.size.x - 1;
                const canInsertButtom = y < this.size.y - 1;
                const canInsertLeft = x > 0;
                //縦横4方向の連結
                if(canInsertTop) curr.top = this.squares[y - 1][x];
                if(canInsertRight) curr.right = this.squares[y][x + 1];
                if(canInsertButtom) curr.bottom = this.squares[y + 1][x];
                if(canInsertLeft) curr.left = this.squares[y][x - 1];

                
                const canInsertTopRight = x < this.size.x - 1 && y > 0;
                const canInsertTopLeft = x > 0 && y > 0;
                const canInsertBottomRight = x < this.size.x - 1 && y < this.size.y - 1;
                const canInsertBottomLeft = x > 0 && y < this.size.y - 1;
                //斜め4方向の連結
                if(canInsertTopRight) curr.topRight = this.squares[y - 1][x + 1];
                if(canInsertTopLeft) curr.topLeft = this.squares[y - 1][x - 1];
                if(canInsertBottomRight) curr.bottomRight = this.squares[y + 1][x + 1];
                if(canInsertBottomLeft) curr.bottomLeft = this.squares[y + 1][x - 1];
            }
        }
        return this;
    }

    public build(): Board {
        return new Board(this.size, this.squares);
    }

    public reset(): BoardBuilder {
        this.size = {x: 0, y: 0};
        this.squares = [];
        return this;
    }
}

export default BoardBuilder;
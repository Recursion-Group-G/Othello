import Square from "../models/square";
import Board from "../models/board";
interface Size {
    x: number;
    y: number;
}

class BoardBuilder {
    private size: Size;
    private squares: Square[][];

    public constructor() {
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

                //currから見た方向
                const top : number= y - 1;
                const right : number = x + 1;
                const left : number = x - 1;
                const bottom : number = y + 1;
                
                const canInsertTop : boolean = y > 0;
                const canInsertRight : boolean = x < this.size.x - 1;
                const canInsertButtom : boolean = y < this.size.y - 1;
                const canInsertLeft : boolean = x > 0;
                //縦横4方向の連結
                if(canInsertTop) curr.top = this.squares[top][x];
                if(canInsertRight) curr.right = this.squares[y][right];
                if(canInsertButtom) curr.bottom = this.squares[bottom][x];
                if(canInsertLeft) curr.left = this.squares[y][left];


                const canInsertTopRight : boolean = x < this.size.x - 1 && y > 0;
                const canInsertTopLeft : boolean = x > 0 && y > 0;
                const canInsertBottomRight : boolean = x < this.size.x - 1 && y < this.size.y - 1;
                const canInsertBottomLeft : boolean = x > 0 && y < this.size.y - 1;
                //斜め4方向の連結
                if(canInsertTopRight) curr.topRight = this.squares[top][right];
                if(canInsertTopLeft) curr.topLeft = this.squares[top][left];
                if(canInsertBottomRight) curr.bottomRight = this.squares[bottom][right];
                if(canInsertBottomLeft) curr.bottomLeft = this.squares[bottom][left];
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
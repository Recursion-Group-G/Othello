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

    setSize(size: Size): BoardBuilder {
        this.size = size;
        return this;
    }

    setSquares(): BoardBuilder {
        let squares : Square[][] = [];
        for(let y : number = 0; y < this.size.y; y++){
            let squareX : Square[] = [];
            for(let x : number = 0; x < this.size.x; x++){
                squareX.push(new Square({x: x, y: y}));
            }
            squares.push(squareX);
        }
    

        for(let y : number = 0; y < this.size.y; y++){
            for(let x : number = 0; x < this.size.x; x++){
                let curr : Square = squares[y][x];
                
                if(y !== 0) curr.top = squares[y - 1][x];
                if(x !== this.size.x - 1) curr.right = squares[y][x + 1];
                if(y !== this.size.y - 1) curr.bottom = squares[y + 1][x];
                if(x !== 0) curr.left = squares[y][x - 1];

                if(x !== this.size.x - 1 && y !== 0) curr.topRight = squares[y - 1][x + 1];
                if(x !== 0 && y !== 0) curr.topLeft = squares[y - 1][x - 1];
                if(x !== this.size.x - 1 && y !== this.size.y - 1) curr.bottomRight = squares[y + 1][x + 1];
                if(x !== 0 && y !== this.size.y - 1) curr.bottomLeft = squares[y + 1][x - 1];
            }
        }
        
        this.squares = squares;
        return this;
    }

    build(): Board {
        return new Board(this.size, this.squares);
    }

    reset(): void {
        this.size = {x: 0, y: 0};
        this.squares = [];
    }
}

let bb = new BoardBuilder();
console.log(bb);

bb.setSize({x: 10, y: 10}).setSquares();

console.log(bb);


export default BoardBuilder;
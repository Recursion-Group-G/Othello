import Square from "../models/square";
import Board from "../models/board";
interface Point {
    x: number;
    y: number;
}

interface Size {
    x: number;
    y: number;
}

class BoardBuilder{
    private size: Size;//ボードのサイズ、幅と高さ、x,y　自分用メモ
    private point: Point;
    private squares: Square[][] = [];

    constructor(){
        this.reset();
    }

    setSize(size: Size): BoardBuilder{
        this.size = size;
        return this;
    }

    setSquares(): BoardBuilder{
        //二次元配列をセット
        let squares : Square[][] = [];
        for(let y : number = 0; y < this.size.y; y++){
            let squareX : Square[] = [];
            for(let x : number = 0; x < this.size.x; x++){
                squareX.push(new Square(new Point(x, y)));
            }
            squares.push(squareX);
        }

        //連結リストをセット
        //端の4点をつなげる

        //端の4辺をつなげる

        //真ん中の全方向をつなげる
        


        this.squares = squares;

        return this;
    }

    build(): Board{
        return new Board(this.size, this.squares);
    }

    reset(): void{
        this.size = null;
        this.squares = [];
    }
}

export default BoardBuilder;
import Square from "../models/square";
import Board from "../models/board";
interface Size {
    x: number;
    y: number;
}

class BoardBuilder{
    private size: Size;//ボードのサイズ、幅と高さ、x,y　自分用メモ
    private squares: Square[][] = [];

    constructor(){
        this.reset();
    }

    setSize(size: Size): BoardBuilder{
        this.size = size;
        return this;
    }

    setSquares(): BoardBuilder{
        //linkを作成中
        let squares : Square[][] = [];




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
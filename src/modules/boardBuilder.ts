import Square from "../models/square";
import Board from "../models/board";
interface Size {
    x: number;
    y: number;
}

class BoardBuilder{
    size: Size//ボードのサイズ、幅と高さ、x,y　自分用メモ
    squares: Square[][];

    constructor(){
        this.reset();
    }

    setSize(size: Size){
        this.size = size;
        return this;
    }

    setSquares(){
        //linkを作成中
        let squares : Square[][] = [];




        this.squares = squares;

        return this;
    }

    build(){
        return new Board(this.size, this.squares);
    }

    reset(){
        this.size = null;
        this.squares = null;
    }
}
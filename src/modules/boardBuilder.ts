class BoardBuilder{
    size;//ボードのサイズ、幅と高さ、x,y　自分用メモ
    squares;

    constructor(){
        this.reset();
    }

    setSize(size){
        this.size = size;
        return this;
    }

    setSquares(){
        //linkを作成中
        let squares = [];




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
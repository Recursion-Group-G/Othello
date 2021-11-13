class BoardBuilder{
    size;
    squares;

    constructor(){
        this.reset();
    }

    setSize(size){
        this.size = size;
        return this;
    }

    setSquare(){
        //linkを作成中

        return this;
    }

    build(){
        return new Board(this.size, this.squares);
    }

    reset(){
        this.size = 0;
        this.squares = null;
    }
}
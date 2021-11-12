import Color from './stone'

class Player {
    name: string;
    score: number;
    color: Color;
    isCpu: boolean;

    constructor(name: string, score: number, color: Color, isCpu: boolean) {
        this.name = name;
        this.score = score;
        this.color = color;
        this.isCpu = isCpu;
    }
}

export default Player;

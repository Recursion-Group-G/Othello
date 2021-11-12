class Player {
    name: string;
    score: number;
    color: string;
    isCpu: boolean;

    constructor(name: string, score: number, color: string, isCpu: boolean) {
        this.name = name;
        this.score = score;
        this.color = color;
        this.isCpu = isCpu;
    }
}

export default Player;

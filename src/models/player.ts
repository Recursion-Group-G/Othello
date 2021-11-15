import Color from '@/interfaces/color';

class Player {
    name: string;
    score: number;
    color: Color | null;
    isCpu: boolean;

    constructor() {
        this.name = '';
        this.score = 0;
        this.color = null;
        this.isCpu = false;
    }
}

export default Player;

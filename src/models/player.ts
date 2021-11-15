import Color from '@/interfaces/color';
import Config from '@/config';

class Player {
    name: string;
    score: number;
    color: Color;
    isCpu: boolean;

    constructor() {
        this.name = '';
        this.score = 0;
        this.color = Config.stone.color.black;
        this.isCpu = false;
    }
}

export default Player;

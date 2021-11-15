import Color from './color';
import Size from './size';

interface Config {
    top: {
        modes: { [key: string]: string }[];
        nameCounter: number;
        indexModePvP: 0;
        indexModePvC: 1;
    };
    stone: {
        color: {
            [key: string]: Color;
        };
    };
    board: {
        size: Size;
    };
    square: {
        size: Size;
    };
    player: {
        number: {
            [key: string]: number;
        };
        initialScore: number;
        playerIndex: number;
        cpuIndex: number;
        cpuName: string;
    };
    table: {
        phase: {
            [key: string]: number;
        };
    };
}

export default Config;

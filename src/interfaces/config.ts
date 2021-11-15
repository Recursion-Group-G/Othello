import Color from './color';
import Size from './size';

interface Config {
    modes: {
        [key: string]: string;
    };
    nameCounter: number;
    indexModePvP: 0;
    indexModePvC: 1;
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

import Color from './color';
import Size from './size';

interface Config {
    top: {
        modes: { [key: string]: string }[];
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
    };
    table: {
        phase: {
            [key: string]: number;
        };
    };
    localStorage: {
        [key: string]: string;
    };
}

export default Config;

import Color from './color';
import Direction from './direction';
import Size from './size';

interface Config {
    modes: {
        [key: string]: string;
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
        validation: {
            name: {
                min: number;
                max: number;
            };
        };
        number: {
            [key: string]: number;
        };
        playerIndex: number;
        cpuIndex: number;
        cpuName: string;
        initialScore: number;
    };
    table: {
        phase: {
            [key: string]: number;
        };
    };
    localStorage: {
        [key: string]: string;
    };
    direction: {
        [key: string]: string;
    };
}

export default Config;

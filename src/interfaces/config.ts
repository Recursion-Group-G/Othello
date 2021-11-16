import Color from './color';
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
    };
    table: {
        phase: {
            [key: string]: number;
        };
    };
}

export default Config;

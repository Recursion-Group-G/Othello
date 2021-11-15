import Config from './interfaces/config';

const config: Config = {
    modes: {
        PvP: 'Player VS Player',
        PvC: 'Player VS CPU',
    },
    nameCounter: 10, //プレイヤーの最大入力文字数
    indexModePvP: 0, //top.modes[{}]からmodeNameのstringを探すためのIndex
    indexModePvC: 1, //top.modes[{}]からmodeNameのstringを探すためのIndex
    stone: {
        color: {
            black: {
                code: '#000000',
                id: 0,
            },
            white: {
                code: '#ffffff',
                id: 1,
            },
        },
    },
    board: {
        size: {
            x: 8,
            y: 8,
        },
    },
    square: {
        size: {
            x: 8,
            y: 8,
        },
    },
    player: {
        number: {
            min: 2,
            max: 2,
        },
        playerIndex: 0, //CPUモードだったときのPlayer Index
        cpuIndex: 1,
        cpuName: 'CPU',
    },
    table: {
        phase: {
            thinking: 0,
            skip: 1,
            roundover: 2,
        },
    },
};

export default config;

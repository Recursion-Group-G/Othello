import Config from './interfaces/config';

const config: Config = {
    modes: {
        PvP: 'Player VS Player',
        PvC: 'Player VS CPU',
    },
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
        validation: {
            name: {
                min: 2,
                max: 10,
            },
        },
        number: {
            min: 2,
            max: 2,
        },
        playerIndex: 0, //CPUモードだったときのPlayer Index
        cpuIndex: 1,
        cpuName: 'CPU',
        initialScore: 2,
    },
    table: {
        phase: {
            thinking: 0,
            skip: 1,
            roundover: 2,
        },
    },
    localStorage: {
        table: 'table',
        players: 'players',
        turnCounter: 'turnCounter',
        stones: 'stones',
    },
    direction: {
        top: 'top',
        left: 'left',
        right: 'right',
        bottom: 'bottom',
        topLeft: 'topLeft',
        topRight: 'topRight',
        bottomLeft: 'bottomLeft',
        bottomRight: 'bottomRight',
    },
};

export default config;

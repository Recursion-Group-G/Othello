interface Config {
    top: {
        modes: { [key: string]: string }[];
        nameCounter: number;
    };
    stone: {
        color: {
            [key: string]: {
                code: string;
                id: number;
            };
        };
    };
    board: {
        size: {
            [key: string]: number;
        };
    };
    square: {
        size: {
            [key: string]: number;
        };
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

const config: Config = {
    top: {
        modes: [
            { modeString: 'Player VS Player', modeName: 'PvP' },
            { modeString: 'Player VS CPU', modeName: 'PvC' },
        ],
        nameCounter: 10, //プレイヤーの最大入力文字数
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
            row: 8,
            col: 8,
        },
    },
    square: {
        size: {
            row: 8,
            col: 8,
        },
    },
    player: {
        number: {
            min: 2,
            max: 2,
        },
        initialScore: 2,
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

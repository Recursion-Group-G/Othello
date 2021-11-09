interface Config {
    stone: {
        color: {
            [key: string]: string;
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
    };
    table: {
        phase: {
            [key: number]: string;
        };
    };
}

const config: Config = {
    stone: {
        color: {
            black: '#000000',
            white: '#ffffff',
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
    },
    table: {
        phase: {
            0: 'thinking',
            1: 'skip',
            2: 'roundover',
        },
    },
};

export default config
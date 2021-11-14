interface Config {
    top: {
        modes: { [key: string]: string }[];
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
    };
    table: {
        phase: {
            [key: string]: number;
        };
    };
}

export default Config;
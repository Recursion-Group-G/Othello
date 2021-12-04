import Square from '@/models/square';
import Stone from '@/models/stone';
import Table from '@/models/table';
import Player from '@/models/player';
import Config from '../config';

class LocalStorage {
    public static saveTable(table: Table): void {
        const tableJsonDecoded = JSON.stringify(table);
        localStorage.setItem(Config.localStorage.table, tableJsonDecoded);
    }

    public static fetchTable(): Table {
        const jsonTable = localStorage.getItem(Config.localStorage.table);
        return jsonTable ? JSON.parse(jsonTable) : {};
    }

    public static clearData(): void {
        localStorage.clear();
    }

    public static fetchPlayers(): Player[] {
        const jsonPlayers = localStorage.getItem(Config.localStorage.players);
        return jsonPlayers ? JSON.parse(jsonPlayers) : {};
    }

    public static fetchTurnCounter(): number {
        const jsonTurnCounter = localStorage.getItem(Config.localStorage.turnCounter);
        return jsonTurnCounter ? parseInt(jsonTurnCounter) : 0;
    }

    public static fetchStones(): { key: Stone } {
        const jsonStones = localStorage.getItem(Config.localStorage.stones);
        return jsonStones ? JSON.parse(jsonStones) : null;
    }

    public static saveGame(table: Table): void {
        if (table !== null && table.board !== null) {
            const playersJsonDecoded = JSON.stringify(table.players);
            const turnCounterJsonDecodes = JSON.stringify(table.turnCounter);

            const stones = {};
            for (let y = 0; y < Config.square.size.y; y++) {
                for (let x = 0; x < Config.square.size.x; x++) {
                    const curr: Square = table.board.squares[x][y];
                    if (curr.stone !== null) stones[curr.id] = curr.stone;
                }
            }
            const stonesJsonDecoded = JSON.stringify(stones);

            localStorage.setItem(Config.localStorage.players, playersJsonDecoded);
            localStorage.setItem(Config.localStorage.turnCounter, turnCounterJsonDecodes);
            localStorage.setItem(Config.localStorage.stones, stonesJsonDecoded);
        }
    }
}

export default LocalStorage;

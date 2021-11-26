import Table from '@/models/table';
import Config from '../config';

class LocalStorage {
    public static saveTable(table: Table): void {
        let tableJsonDecoded = JSON.stringify(table);
        localStorage.setItem(Config.localStorage.table, tableJsonDecoded);
    }

    public static fetchTable(): Table {
        let jsonTable = localStorage.getItem(Config.localStorage.table);
        return jsonTable ? JSON.parse(jsonTable) : {}
    }

    public static clearData(): void {
        localStorage.clear();
    }
}

export default LocalStorage;

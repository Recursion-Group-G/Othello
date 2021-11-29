import Table from '@/models/table';
import Config from '../config';

class LocalStorage {
    public static saveTable(table: Table): void {
        const decycle = require('json-cyclic').decycle;// eslint-disable-line
        const tableJsonDecoded = JSON.stringify(decycle(table));
        localStorage.setItem(Config.localStorage.table, tableJsonDecoded);
    }

    public static fetchTable(): Table {
        const { encycle } = require('json-cyclic'); // eslint-disable-line
        const jsonTable = localStorage.getItem(Config.localStorage.table);
        return jsonTable ? encycle(JSON.parse(jsonTable)) : {};
    }

    public static clearData(): void {
        localStorage.clear();
    }
}

export default LocalStorage;

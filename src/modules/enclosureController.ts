import Square from '@/models/square';
import Enclosure from '@/models/enclosure';

class EnclosureController {
    public head: Enclosure | null;
    public tail: Enclosure | null;
    public hashmap: { [key: string]: Enclosure };

    public constructor() {
        this.head = null;
        this.tail = null;
        this.hashmap = {};
    }

    public addEnclosure(square: Square): void {
        const enclosure: Enclosure = new Enclosure(square);
        if (this.head === null) {
            this.head = enclosure;
            this.tail = this.head;
        }
        //headのみを更新
        else {
            this.head.prev = enclosure;
            enclosure.next = this.head;
            this.head = enclosure;
        }
        //hashmap追加
        this.hashmap[square.id] = enclosure;
    }

    public removeEnclosure(square: Square): void {
        if (!this.hashmap[square.id]) return;
        const enclosure: Enclosure = this.hashmap[square.id];

        this.deleteEnclosure(enclosure);
        delete this.hashmap[square.id];
    }

    private deleteEnclosure(enclosure: Enclosure): void {
        // Enclosureがheadの場合
        if (enclosure.prev === null) this.popFrontEnclosure();
        // Enclosureが末尾の場合
        else if (enclosure.next === null) this.popEnclosure();
        // Enclosureが真ん中の場合
        else if (enclosure.prev != null && enclosure.next != null) {
            //nullの表示エラー回避
            enclosure.prev.next = enclosure.next;
            enclosure.next.prev = enclosure.prev;
        }
    }

    public getEnclosure(square: Square): Enclosure {
        return this.hashmap[square.id];
    }

    private popFrontEnclosure(): void {
        this.head = this.head != null ? this.head.next : null; //nullの表示エラー回避
        if (this.head != null) this.head.prev = null; //nullの表示エラー回避
    }

    private popEnclosure(): void {
        this.tail = this.tail != null ? this.tail.prev : null; //nullの表示エラー回避
        if (this.tail != null) this.tail.next = null; //nullの表示エラー回避
    }

    //localStorageからのデータ復旧head
    public setHead(head: Enclosure | null): EnclosureController {
        this.head = head;
        return this;
    }

    //localStorageからのデータ復旧tail
    public setTail(tail: Enclosure | null): EnclosureController {
        this.tail = tail;
        return this;
    }

    //localStorageからのデータ復旧hashmap
    public setHashMap(hashmap: {
        [key: string]: Enclosure;
    }): EnclosureController {
        this.hashmap = hashmap;
        return this;
    }
}

export default EnclosureController;

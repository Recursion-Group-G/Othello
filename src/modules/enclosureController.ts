import Square from '@/models/square';
import Board from '@/models/board';
import Enclosure from '@/models/enclosure';

class EnclosureController {
    private head: Enclosure | null;
    private hashmap: { [key: string]: Enclosure | null };

    public constructor() {
        this.head = null;
        this.hashmap = {};
    }

    //Boardからすべての座標がnullのhashmapを作成//後で消すかも
    public createHashmapFromSquare(
        board: Board
    ): { [key: string]: Enclosure | null } {
        const sizeX: number = board.size.x;
        const sizeY: number = board.size.y;
        const hashmap: { [key: string]: Enclosure | null } = {};
        for (let i = 0; i < sizeX; i++) {
            for (let j = 0; j < sizeY; j++) {
                //一旦Enclosureは全部null
                hashmap[board.squares[i][j].id] = null;
            }
        }
        return hashmap;
    }

    //初期状態(石を4つおいた時点)から最初にEnclosureを作成
    public createInitialEnclosure(board: Board): EnclosureController {
        const initialPoint = 4; //一旦仮
        const topLeftSquare: Square = board.squares[initialPoint][initialPoint];
        const topRightSquare: Square =
            board.squares[initialPoint + 1][initialPoint];
        const bottomLeftSquare: Square =
            board.squares[initialPoint][initialPoint + 1];
        const bottomRightSquare: Square =
            board.squares[initialPoint + 1][initialPoint + 1];

        this.updateFromSquare(topLeftSquare);
        this.updateFromSquare(topRightSquare);
        this.updateFromSquare(bottomLeftSquare);
        this.updateFromSquare(bottomRightSquare);
        return this;
    }

    public addEnclosure(square: Square): void {
        const enclosure: Enclosure = new Enclosure(square);
        if (this.head === null) this.head = enclosure;
        this.head.prev = enclosure;
        enclosure.next = this.head;
        this.head = enclosure;
        //hashmap追加
        this.hashmap[square.id] = enclosure;
    }

    public removeEnclosure(square: Square): void {
        if (this.head === null) return;
        if (square === this.head.data) this.popFrontEnclosure();
        const enclosure: Enclosure | null = this.hashmap[square.id];
        //nullの表示エラー回避
        if (
            enclosure === null ||
            enclosure.prev === null ||
            enclosure.next === null
        )
            return;
        enclosure.prev.next = enclosure.next;
        enclosure.next.prev = enclosure.prev;
        //hashmapから削除
        delete this.hashmap[square.id];
        //this.hashmap[square.id] === nullをどこかの判定で使う場合
        //this.hashmap[square.id] = null;
    }

    private popFrontEnclosure(): void {
        this.head = this.head != null ? this.head.next : null; //nullの表示エラー回避
        if (this.head != null) this.head.prev = null; //nullの表示エラー回避
    }

    public getEnclosure(square: Square): Enclosure | null {
        return this.hashmap[square.id];
    }

    public updateFromSquare(square: Square): void {
        const isPresentInHashmap = (square: Square) => {
            return this.hashmap[square.id] != undefined;
        };
        const isStoneEmpty = (square: Square) => {
            return square.isEmpty;
        };
        const updateSquare = (square: Square) => {
            //hashmapにEnclosureがなくSquareに石がない場合
            if (!isPresentInHashmap(square) && isStoneEmpty(square)) {
                this.addEnclosure(square);
            }
            //hashmapにEnclosureがあってSquareに石がある場合
            else if (isPresentInHashmap(square) && !isStoneEmpty(square)) {
                this.removeEnclosure(square);
            }
        };
        updateSquare(square);
        //8方向にアップデート
        //nullの表示エラー回避
        if (square.top != null) updateSquare(square.top);
        if (square.left != null) updateSquare(square.left);
        if (square.right != null) updateSquare(square.right);
        if (square.bottom != null) updateSquare(square.bottom);

        if (square.topLeft != null) updateSquare(square.topLeft);
        if (square.topRight != null) updateSquare(square.topRight);
        if (square.bottomLeft != null) updateSquare(square.bottomLeft);
        if (square.bottomRight != null) updateSquare(square.bottomRight);
    }
}

export default EnclosureController;

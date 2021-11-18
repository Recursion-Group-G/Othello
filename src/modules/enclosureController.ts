import Square from '@/models/square';
import Board from '@/models/board';
import Enclosure from '@/models/enclosure';

class EnclosureController {
    private head: Enclosure | null;
    private hashmap: { [key: string]: Enclosure | null };
    private enclosures: Enclosure[];

    public constructor(board: Board) {
        this.head = null;
        this.hashmap = this.createHashmapFromSquare(board);
        this.enclosures = [];
    }

    //Boardからhashmapを作成
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

        this.checkAllDirectionsFromSquare(board, topLeftSquare);
        this.checkAllDirectionsFromSquare(board, topRightSquare);
        this.checkAllDirectionsFromSquare(board, bottomLeftSquare);
        this.checkAllDirectionsFromSquare(board, bottomRightSquare);

        return this;
    }

    //Squareから8方向検索
    public checkAllDirectionsFromSquare(
        board: Board,
        square: Square
    ): EnclosureController {
        const topX: number = square.point.x;
        const topY: number = square.point.y - 1;
        this.createEnclosure(board.squares[topX][topY]);

        const leftX: number = square.point.x - 1;
        const leftY: number = square.point.y;
        this.createEnclosure(board.squares[leftX][leftY]);

        const rightX: number = square.point.x + 1;
        const rightY: number = square.point.y;
        this.createEnclosure(board.squares[rightX][rightY]);

        const bottomX: number = square.point.x;
        const bottomY: number = square.point.y + 1;
        this.createEnclosure(board.squares[bottomX][bottomY]);

        const topLeftX: number = square.point.x - 1;
        const topLeftY: number = square.point.y - 1;
        this.createEnclosure(board.squares[topLeftX][topLeftY]);

        const topRightX: number = square.point.x + 1;
        const topRightY: number = square.point.y - 1;
        this.createEnclosure(board.squares[topRightX][topRightY]);

        const bottomLeftX: number = square.point.x - 1;
        const bottomLeftY: number = square.point.y + 1;
        this.createEnclosure(board.squares[bottomLeftX][bottomLeftY]);

        const bottomRightX: number = square.point.x + 1;
        const bottomRightY: number = square.point.y + 1;
        this.createEnclosure(board.squares[bottomRightX][bottomRightY]);

        return this;
    }

    //Squareに石がなくてhashmapに座標のEnclosureがない場合作成
    public createEnclosure(square: Square): EnclosureController {
        if (square.isEmpty && this.hashmap[square.id] === null) {
            const newEnclosure: Enclosure = new Enclosure(square);
            this.hashmap[square.id] = newEnclosure;
            this.enclosures.push(newEnclosure);
        }
        return this;
    }

    //Enclosurs内すべてのEnclosureを連結
    public linkEnclosureAll(enclosures: Enclosure[]): EnclosureController {
        const firstEnclosure: Enclosure = enclosures[0];
        this.head = firstEnclosure;
        let curr: Enclosure = this.head;
        for (let i = 1; i < enclosures.length; i++) {
            curr.next = enclosures[i];
            curr.next.prev = curr;
            curr = curr.next;
        }
        //最後に最初のEnclosureと連結
        curr.next = firstEnclosure;
        curr.next.prev = curr;

        return this;
    }

    static removeEnclosure(square: Square): void {}

    static addEnclosure(square: Square): void {}

    static getEnclosure(square: Square): void {}
}

export default EnclosureController;

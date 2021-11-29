import Square from '@/models/square';
import Player from '@/models/player';
import EnclosureController from './enclosureController';
import Enclosure from '@/models/enclosure';
import Config from '@/config';
import AllowedDirections from '@/models/allowedDirections';
import Direction from '@/interfaces/direction';

/*
checkAllowedSquares
プレイヤーが石が置ける場所を探してSquareの更新を行う
プレイヤーがスキップするか、石を返す方向も判別が可能
*/
class CheckAllowedSquares {
    //Game.vueで石の返せる方向を判別
    static allDirections: { [key: string]: boolean } = {
        [Config.direction.top]: false,
        [Config.direction.left]: false,
        [Config.direction.right]: false,
        [Config.direction.bottom]: false,
        [Config.direction.topLeft]: false,
        [Config.direction.topRight]: false,
        [Config.direction.bottomLeft]: false,
        [Config.direction.bottomRight]: false,
    };

    //Game.vueから石を置ける場所を探すために呼び出す
    public static searchAllowedSquares(
        player: Player,
        enclosureController: EnclosureController
    ): void {
        const playerColor: string = player.color.code;

        let iterator: Enclosure | null = enclosureController.head;
        //enclosureを一つずつたどり、8方向を検索する
        while (iterator != null) {
            //8方向石が置けるか確認
            this.checkAllDirecstions(iterator, playerColor);
            //8方向のうちいずれか石が返せるようであれば、square.isAllowedToPlaceをtrueにして、AllowedDirectionsのインスタンス作成
            if (!this.isSquareAbleToPlace()) {
                if (iterator.data != null) iterator.data.isAllowedToPlace = true;
                if (iterator.data != null) {
                    const allDirections = JSON.parse(JSON.stringify(this.allDirections));
                    iterator.data.allowedDirections = allDirections as AllowedDirections;
                }
            }
            iterator = iterator.next;
            //iteratorが次のポインタに移動した後、allDirectionsをリセット
            this.resetAllDirections();
        }
    }

    //8方向の石がある場所を確認
    private static checkAllDirecstions(enclosure: Enclosure, playerColor: string): void {
        if (enclosure.data === null) return; //nullの表示エラー回避
        //Enclosureの位置から8方向のSquareを取得
        const hashmap: { [key: string]: Square | null } = {
            [Config.direction.top]: enclosure.data.top,
            [Config.direction.left]: enclosure.data.left,
            [Config.direction.right]: enclosure.data.right,
            [Config.direction.bottom]: enclosure.data.bottom,
            [Config.direction.topLeft]: enclosure.data.topLeft,
            [Config.direction.topRight]: enclosure.data.topRight,
            [Config.direction.bottomLeft]: enclosure.data.bottomLeft,
            [Config.direction.bottomRight]: enclosure.data.bottomRight,
        };

        for (const direction in hashmap) {
            //isEmpty === falseの時にその方向を探索、場所を発見した時点で一方向を検索
            if (!hashmap[direction]?.isEmpty) {
                this.checkOneDirection(
                    hashmap[direction],
                    direction as keyof Direction,
                    playerColor
                );
            }
        }
    }

    //1方向のみの検索
    private static checkOneDirection(
        square: Square | null,
        direction: keyof Direction,
        playerColor: string
    ): void {
        let curr: Square | null = square;
        //石が自分と同じ色か判別
        const isSameColor = (currentSquare: Square) => {
            return currentSquare.stone?.color.code === playerColor;
        };
        //石が置かれているか判別
        const isStoneEmpty = (currentSquare: Square) => {
            return currentSquare.isEmpty;
        };


        while (curr != null && curr.stone != null && (!isSameColor(curr) || isStoneEmpty(curr))) {
            curr = curr[direction];
        }

        //石の色がPlayerの色と同じ場合は石を置けるのでその方向をtrueにする
        if (curr != null && square != null && isSameColor(curr) && !isSameColor(square)) {
            this.allDirections[direction] = true;
        }
    }

    public static isSquareAbleToPlace(): boolean {
        for (const key in this.allDirections) {
            if (this.allDirections[key]) return false;
        }
        return true;
    }

    //ターンが変わったらIsAllowedSquaresとallDirectionsをリセット
    public static resetAfterTurnOver(enclosureController: EnclosureController): void {
        let iterator: Enclosure | null = enclosureController.head;
        //isAlloedToPlaceとallowedDirectionsの初期化
        while (iterator != null) {
            if (iterator.data != null && iterator.data.isAllowedToPlace) {
                iterator.data.isAllowedToPlace = false;
                if (iterator.data.allowedDirections != undefined) {
                    iterator.data.allowedDirections = new AllowedDirections();
                }
            }
            iterator = iterator.next;
        }
        this.resetAllDirections();
    }

    private static resetAllDirections(): void {
        //allDirectionsの初期化
        for (const key in this.allDirections) {
            if (this.allDirections[key]) {
                this.allDirections[key] = false;
            }
        }
    }
}

export default CheckAllowedSquares;

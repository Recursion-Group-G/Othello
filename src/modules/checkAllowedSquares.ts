import Square from '@/models/square';
import Player from '@/models/player';
import EnclosureController from './enclosureController';
import Enclosure from '@/models/enclosure';
import Config from '@/config';

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
            //8方向のうちいずれか石が返せるようであれば、square.isAllowedToPlaceをtrueにする
            if (!this.isSkipped()) {
                if (iterator.data != null) iterator.data.isAllowedToPlace = true;
            }
            iterator = iterator.next;
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
                this.checkOneDirection(hashmap[direction], direction, playerColor);
            }
        }
    }

    //1方向のみの検索
    private static checkOneDirection(
        square: Square | null,
        direction: string,
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

        //方向を判断して石の色が同じか、石が置かれていない場所まで探索
        switch (direction) {
            case Config.direction.top: {
                while (curr != null && (isSameColor(curr) || isStoneEmpty(curr))) {
                    curr = curr.top;
                }
            }
            case Config.direction.left: {
                while (curr != null && (isSameColor(curr) || isStoneEmpty(curr))) {
                    curr = curr.left;
                }
            }
            case Config.direction.right: {
                while (curr != null && (isSameColor(curr) || isStoneEmpty(curr))) {
                    curr = curr.right;
                }
            }
            case Config.direction.bottom: {
                while (curr != null && (isSameColor(curr) || isStoneEmpty(curr))) {
                    curr = curr.bottom;
                }
            }
            case Config.direction.topLeft: {
                while (curr != null && (isSameColor(curr) || isStoneEmpty(curr))) {
                    curr = curr.topLeft;
                }
            }
            case Config.direction.topRight: {
                while (curr != null && (isSameColor(curr) || isStoneEmpty(curr))) {
                    curr = curr.topRight;
                }
            }
            case Config.direction.bottomLeft: {
                while (curr != null && (isSameColor(curr) || isStoneEmpty(curr))) {
                    curr = curr.bottomLeft;
                }
            }
            case Config.direction.bottomRight: {
                while (curr != null && (isSameColor(curr) || isStoneEmpty(curr))) {
                    curr = curr.bottomRight;
                }
            }
            //もし合致する色がないときはメッセージ
            default:
                console.log('The direction should be in Config.direction.');
        }

        //石の色がPlayerの色と同じ場合は石を置けるのでその方向をtrueにする
        if (curr != null && isSameColor(curr)) {
            this.allDirections[direction] = true;
        }
    }

    //playerがスキップするか判断、Game.vueからも呼び出し可能
    public static isSkipped(): boolean {
        for (const key in this.allDirections) {
            if (this.allDirections[key]) return false;
        }
        return true;
    }

    //石の返せる方向をGame.vueから呼び出し
    public static returnDirectionCache(): { [key: string]: boolean } {
        return this.allDirections;
    }

    //ターンが変わったらIsAllowedSquaresとallDirectionsをリセット
    public static resetAfterTurnOver(enclosureController: EnclosureController): void {
        let iterator: Enclosure | null = enclosureController.head;
        //isAlloedToPlaceの初期化
        while (iterator != null) {
            if (iterator.data != null && iterator.data.isAllowedToPlace) {
                iterator.data.isAllowedToPlace = false;
            }
            iterator = iterator.next;
        }
        //allDirectionsの初期化
        for (const key in this.allDirections) {
            if (this.allDirections[key]) {
                this.allDirections[key] = false;
            }
        }
    }
}

export default CheckAllowedSquares;

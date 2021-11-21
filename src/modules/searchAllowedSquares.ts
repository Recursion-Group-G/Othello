import Square from "@/models/square";
import Player from "@/models/player";
import EnclosureController from "./enclosureController";
import Enclosure from "@/models/enclosure";
import Config from "@/config";

class SearchAllowedSquares {
    public static searchAllowedSquares(player: Player, enclosureController: EnclosureController): void {
        const playerColor: string = player.color.code;

        let iterator: Enclosure | null = enclosureController.head
        //enclosureを一つずつたどり、8方向を検索する
        while(iterator != null) {
            if(this.isAllowedSquareAllDirecstions(iterator, playerColor)) {
                if(iterator.data != null) iterator.data.isAllowedToPlace = true;
            }
            iterator = iterator.next;
        }
    }

    //8方向に検索
    private static isAllowedSquareAllDirecstions(enclosure: Enclosure, playerColor: string): boolean{
        if(enclosure.data === null) return false; //nullの表示エラー回避
        //Enclosureの位置から8方向のSquareを取得
        const hashmap: {[key: string]: Square | null} = {
            [Config.direction.top] : enclosure.data.top,
            [Config.direction.left] : enclosure.data.left,
            [Config.direction.right] : enclosure.data.right,
            [Config.direction.bottom] : enclosure.data.bottom,
            [Config.direction.topLeft] : enclosure.data.topLeft,
            [Config.direction.topRight] : enclosure.data.topRight,
            [Config.direction.bottomLeft] : enclosure.data.bottomLeft,
            [Config.direction.bottomRight] : enclosure.data.bottomRight,
        }
        for(let direction in hashmap){
            //isEmpty === falseの時にその方向を探索
            if(hashmap[direction]?.isEmpty != true && this.isAllowedSquareOneDirection(hashmap[direction], direction, playerColor)){
                return true;
            }
        }
        //最後まで場所が見つからなければfalse
        return false;
    }

    //1方向のみの検索
    private static isAllowedSquareOneDirection(square: Square | null, direction: string, playerColor: string): boolean {
        let curr: Square | null = square;
        //石の色が同じか、石が置かれていない場所まで探索
        while(curr?.stone?.color.code === playerColor|| curr?.isEmpty){
            //方向をswitch
            if(curr != null) curr = curr.top;
        }
        //石の色がPlayerの色と同じ場合、trueを返す
        return curr?.stone?.color.code === playerColor
    }
}

export default SearchAllowedSquares;
import Square from '@/models/square';
import EnclosureController from './enclosureController';

/*
UpdateEnclosure
石を置いた時、SquareとEnclosureControllerを受け取り、石の8方向検索を実施し
Enclosureの連結リストをアップデートする
*/
class UpdateEnclosure {
    public static updateFromSquare(square: Square, enclosureController: EnclosureController): void {
        const isPresentInHashmap = (square: Square) => {
            return enclosureController.hashmap[square.id] != undefined;
        };

        const isStoneEmpty = (square: Square) => {
            return square.isEmpty;
        };

        const updateSquare = (square: Square) => {
            //hashmapにEnclosureがなくSquareに石がない場合
            if (!isPresentInHashmap(square) && isStoneEmpty(square)) {
                enclosureController.addEnclosure(square);
            }
            //hashmapにEnclosureがあってSquareに石がある場合
            else if (isPresentInHashmap(square) && !isStoneEmpty(square)) {
                enclosureController.removeEnclosure(square);
            }
        };

        updateSquare(square);
        //8方向にアップデートを実施
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

export default UpdateEnclosure;

import Stone from './stone';
import Point from '../interfaces/point';

class Square {
    point: Point;
    stone: Stone | null;
    isEmpty: boolean;

    top: Square | null;
    right: Square | null;
    bottom: Square | null;
    left: Square | null;

    topRight: Square | null;
    topLeft: Square | null;
    bottomRight: Square | null;
    bottomLeft: Square | null;

    constructor(point: Point) {
        this.point = point;
        this.stone = null;
        this.isEmpty = false;

        this.top = null;
        this.right = null;
        this.bottom = null;
        this.left = null;
        this.topRight = null;
        this.topLeft = null;
        this.bottomRight = null;
        this.bottomLeft = null;
    }
}

export default Square;

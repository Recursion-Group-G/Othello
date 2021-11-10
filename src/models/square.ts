import Stone from './stone';

interface Point {
    x: number
    y: number
}

class Square {
    point: Point
    stone: Stone | null;
    isEmpty: boolean;

    constructor(point: Point) {
        this.point = point;
        this.stone = null;
        this.isEmpty = false;
    }
}

export default Square;
import Stone from './stone';
import Point from '../interfaces/point';
import AllowedDirections from './allowedDirections';

class Square {
    point: Point;
    stone: Stone | null;
    isEmpty: boolean;
    id: string;
    isAllowedToPlace: boolean;
    allowedDirections: AllowedDirections | undefined;

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
        this.isEmpty = true;
        this.id = this.createId(point);
        this.isAllowedToPlace = false;
        this.allowedDirections = new AllowedDirections();

        this.top = null;
        this.right = null;
        this.bottom = null;
        this.left = null;
        this.topRight = null;
        this.topLeft = null;
        this.bottomRight = null;
        this.bottomLeft = null;
    }

    createId(point: Point): string {
        return String(point.x) + '-' + String(point.y);
    }
}

export default Square;

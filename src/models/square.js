"use strict";
exports.__esModule = true;
var Square = /** @class */ (function () {
    function Square(point) {
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
    return Square;
}());
exports["default"] = Square;

"use strict";
exports.__esModule = true;
var square_1 = require("../models/square");
var board_1 = require("../models/board");
var BoardBuilder = /** @class */ (function () {
    function BoardBuilder() {
        this.size = { x: 0, y: 0 };
        this.squares = [];
    }
    BoardBuilder.prototype.setSize = function (size) {
        this.size = size;
        return this;
    };
    BoardBuilder.prototype.setSquares = function () {
        var squares = [];
        for (var y = 0; y < this.size.y; y++) {
            var squareX = [];
            for (var x = 0; x < this.size.x; x++) {
                squareX.push(new square_1["default"]({ x: x, y: y }));
            }
            squares.push(squareX);
        }
        for (var y = 0; y < this.size.y; y++) {
            for (var x = 0; x < this.size.x; x++) {
                var curr = squares[y][x];
                if (y !== 0)
                    curr.top = squares[y - 1][x];
                if (x !== this.size.x - 1)
                    curr.right = squares[y][x + 1];
                if (y !== this.size.y - 1)
                    curr.bottom = squares[y + 1][x];
                if (x !== 0)
                    curr.left = squares[y][x - 1];
                if (x !== this.size.x - 1 && y !== 0)
                    curr.topRight = squares[y - 1][x + 1];
                if (x !== 0 && y !== 0)
                    curr.topLeft = squares[y - 1][x - 1];
                if (x !== this.size.x - 1 && y !== this.size.y - 1)
                    curr.bottomRight = squares[y + 1][x + 1];
                if (x !== 0 && y !== this.size.y - 1)
                    curr.bottomLeft = squares[y + 1][x - 1];
            }
        }
        console.log(squares[0][0].right.left);
        this.squares = squares;
        return this;
    };
    BoardBuilder.prototype.build = function () {
        return new board_1["default"](this.size, this.squares);
    };
    BoardBuilder.prototype.reset = function () {
        this.size = { x: 0, y: 0 };
        this.squares = [];
    };
    return BoardBuilder;
}());
var bb = new BoardBuilder();
bb.setSize({ x: 10, y: 10 }).setSquares();
exports["default"] = BoardBuilder;

import Enclosure from "@/models/enclosure";
import Player from "@/models/player";
import Square from "@/models/square";
import EnclosureController from "./enclosureController";
import Direction from '@/interfaces/direction'
import Config from "@/config";

class PlayerDicisions {

    private squares: Square[]
    private player: Player
    private enclosureController: EnclosureController

    constructor(player: Player, enclosureController: EnclosureController) {

        this.squares = []
        this.player = player
        this.enclosureController = enclosureController;

    }
    get() {

        return this.squares;

    }
    // enclosureたどってplayerが置けたらsquaresにpushする=> filterEnclosureByPlayer()
    public filterDicisions() : PlayerDicisions{
        
        let currentEnclosure: Enclosure | null = this.enclosureController.head;

        while (currentEnclosure !== null) {

            const square = currentEnclosure.data;
            if (square == null) return this;
            else if (this.isAbleToPlace(square)) {
                this.squares.push(square);
                square.isAllowedToPlace = true;
            } else {
                square.isAllowedToPlace = false;
            }
            currentEnclosure = currentEnclosure.next

        }

        return this;

    }
    public isAbleToPlace(square: Square): boolean {

        if (square.stone !== null) return false;

        for (let direction in Config.direction) {
            if (this.willGetPoint(square, direction as keyof Direction)) {
                return true;
            }
        }

        return false;

    }
    public willGetPoint(square: Square, direction: keyof Direction): boolean{
        
        //すぐ隣チェック
        //隣にsquareがない or 隣にstoneがない or 隣が同じプレイヤーと同じ色の石を持っている
        let nextSquare: Square | null = square[direction];
        if (
            nextSquare === null ||
            nextSquare.stone === null ||
            nextSquare.stone.color === this.player.color
        ) return false;

        while (nextSquare !== null) {

            if ( nextSquare.stone === null) continue;
            else if (nextSquare.stone.color === this.player.color) {
                return true;
            }

            nextSquare = nextSquare[direction];

        }

        return false;

    }

}
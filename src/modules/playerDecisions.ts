import Config from '@/config';

import Player from '@/models/player';
import Square from '@/models/square';
import Enclosure from '@/models/enclosure';
import AllowedDirections from '@/models/allowedDirections';

import EnclosureController from '@/modules/enclosureController';
import Direction from '@/interfaces/direction';

/**
 * PlayerDicisions
 *
 * EnclosureControllerが持つEnclosureの中からプレイヤーが置ける場所を探す。フィルタリングする。
 * AllowedDirectionsを率いて探索すべき方向をキャッシュする。
 */
class PlayerDicisions {
    private squares: Square[];
    private player: Player;
    private enclosureController: EnclosureController;

    constructor(player: Player, enclosureController: EnclosureController) {
        this.squares = [];
        this.player = player;
        this.enclosureController = enclosureController;
    }
    public get(): Square[] {
        return this.squares;
    }
    public setAllowedDirectionsToSquare(square: Square): void {
        square.allowedDirections = new AllowedDirections();
    }
    public filterDicisions(): PlayerDicisions {
        let currentEnclosure: Enclosure | null = this.enclosureController.head;
        while (currentEnclosure !== null && currentEnclosure.data !== null) {
            const square = currentEnclosure.data;

            if (this.isAbleToPlace(square)) {
                this.cacheAllowedDirections(square);
                square.isAllowedToPlace = true;
                this.squares.push(square);
            } else {
                this.setAllowedDirectionsToSquare(square);
                square.isAllowedToPlace = false;
            }

            currentEnclosure = currentEnclosure.next;
        }

        return this;
    }
    public cacheAllowedDirections(square: Square): void {
        this.setAllowedDirectionsToSquare(square);

        for (const direction in Config.direction) {
            if (
                this.willGetPoint(square, direction as keyof Direction) &&
                square.allowedDirections !== undefined
            ) {
                square.allowedDirections[direction as keyof AllowedDirections] = true;
            }
        }
    }
    public isAbleToPlace(square: Square): boolean {
        if (square.stone !== null) return false;

        for (const direction in Config.direction) {
            if (this.willGetPoint(square, direction as keyof Direction)) {
                return true;
            }
        }

        return false;
    }
    public willGetPoint(square: Square, direction: keyof Direction): boolean {
        let nextSquare: Square | null = square[direction];

        //すぐ隣チェック
        //隣にsquareがない or 隣にstoneがない or 隣が同じプレイヤーと同じ色の石を持っている
        if (
            nextSquare === null ||
            nextSquare.stone === null ||
            nextSquare.stone.color.id === this.player.color.id
        )
            return false;

        while (nextSquare !== null) {
            if (nextSquare.stone === null) return false;
            else if (nextSquare.stone.color.id === this.player.color.id) {
                return true;
            }

            nextSquare = nextSquare[direction];
        }

        return false;
    }
}

export default PlayerDicisions;

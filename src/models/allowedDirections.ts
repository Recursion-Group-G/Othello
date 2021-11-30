class AllowedDirections {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;

    topRight: boolean;
    topLeft: boolean;
    bottomRight: boolean;
    bottomLeft: boolean;

    constructor() {
        this.top = false;
        this.right = false;
        this.bottom = false;
        this.left = false;

        this.topRight = false;
        this.topLeft = false;
        this.bottomRight = false;
        this.bottomLeft = false;
    }
}

export default AllowedDirections;

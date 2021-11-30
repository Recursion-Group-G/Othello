import Color from '../interfaces/color';

class Stone {
    color: Color;
    isVisible: boolean;
    constructor(color: Color) {
        this.color = color;
        this.isVisible = true;
    }
}

export default Stone;

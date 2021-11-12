interface Color {
    code: string;
    id: number;
}

class Stone {
    color: Color;
    constructor(color: Color) {
        this.color = color;
    }
}

export default Stone;

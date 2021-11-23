import Square from '@/models/square';

class Enclosure {
    data: Square | null;
    next: Enclosure | null;
    prev: Enclosure | null;

    constructor(data: Square) {
        this.next = null;
        this.prev = null;
        this.data = data;
    }
}

export default Enclosure;

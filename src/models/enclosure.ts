import Square from '@/models/square'

class Enclosure {
    private data: Square;
    private next: Enclosure | null;
    private prev: Enclosure | null;

    public constructor(data: Square){
        this.next = null;
        this.prev = null;
        this.data = data;
    }
}

export default Enclosure;
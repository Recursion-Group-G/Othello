import Square from '@/models/square';

interface Direction {
    top: Square | null;
    left: Square | null;
    right: Square | null;
    bottom: Square | null;
    topLeft: Square | null;
    topRight: Square | null;
    bottomLeft: Square | null;
    bottomRight: Square | null;
}

export default Direction;

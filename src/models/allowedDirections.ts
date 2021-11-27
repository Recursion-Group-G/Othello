class AllowedDirections {
    allDirections: { [key: string]: boolean };

    constructor(allDirections: { [key: string]: boolean }) {
        this.allDirections = allDirections;
    }
}

export default AllowedDirections;

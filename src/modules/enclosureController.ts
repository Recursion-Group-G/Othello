import Square  from "@/models/square";
import Enclosure from "@/models/enclosure";

class EnclosureController {
    private head: Enclosure;
    //private hashmap: [key: Square, value: Enclosure];

    public constructor(square: Square) {
        this.head = new Enclosure(square);
        //this.hashmap = this.createHashmap();
    }

    public createEnclosure(): EnclosureController {

        return this;
    }
    /*
    public createHashmap(): [key: Square, value: Enclosure] {

        return 
    }
    */

    public linkEnclosure(): EnclosureController {

        return this;
    }

    static removeEnclosure(square: Square):void {

    }

    static addEnclosure(square: Square):void {

    }

    static getEnclosure(square: Square):void {

    }


}

export default EnclosureController;
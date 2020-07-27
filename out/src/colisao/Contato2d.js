import { Vertice2d } from "../geometria/Vertices2d.js";
export class Contato2d extends Vertice2d {
    constructor(vertice) {
        super(vertice.copia, vertice.id);
        this.impulsoNorma = 0;
        this.impulsoTangente = 0;
    }
}
//# sourceMappingURL=Contato2d.js.map
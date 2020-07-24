import { Vetor2d } from "../geometria/Vetor2d";
import { Vertice2d } from "../geometria/Vertices2d";

export class Contato2d extends Vertice2d {
    impulsoNorma: number = 0;
    impulsoTangente: number = 0;
    constructor(
        vertice: Vertice2d
    ) {
        super(vertice.copia, vertice.id)
    }
}
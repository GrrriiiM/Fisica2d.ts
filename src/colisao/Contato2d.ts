import { Vetor2d } from "../geometria/Vetor2d";

export class Contato2d {
    impulsoNorma: number = 0;
    impulsoTangente: number = 0;
    constructor(
        readonly vetor: Vetor2d
    ) {

    }
}
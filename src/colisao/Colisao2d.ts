import { Corpo2d } from "../objetos/Corpo2d";
import { Forma2d } from "../geometria/Forma2d";
import { Eixo2d } from "../geometria/Eixos2d";
import { Vetor2d } from "../geometria/Vetor2d";
import { Contato2d } from "./Contato2d";

export class Colisao2d {
    readonly corpoA: Corpo2d;
    readonly corpoB: Corpo2d;
    eixoForma: Forma2d;
    eixoIndice: number;
    norma: Vetor2d;
    tangente: Vetor2d;
    sobreposicao: number;
    penetracao: Vetor2d;
    contatos = new Array<Contato2d>();
    constructor(
        readonly formaA: Forma2d,
        readonly formaB: Forma2d
    ) {
        this.corpoA = formaA.corpo;
        this.corpoB = formaB.corpo;
    }
}
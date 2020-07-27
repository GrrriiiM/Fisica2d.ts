import { Vetor2d } from "../geometria/Vetor2d.js";
export class Colisao2d {
    constructor(formaA, formaB) {
        this.formaA = formaA;
        this.formaB = formaB;
        this.norma = new Vetor2d();
        this.tangente = new Vetor2d();
        this.penetracao = new Vetor2d();
        this.contatos = new Array();
        this.corpoA = formaA.corpo;
        this.corpoB = formaB.corpo;
    }
}
//# sourceMappingURL=Colisao2d.js.map
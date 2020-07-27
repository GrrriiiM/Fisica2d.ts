import { Vetor2d } from "../geometria/Vetor2d.js";
import { Bordas2d } from "../geometria/Bordas2d.js";
export class Camera2d {
    constructor(largura, altura, zoom = 1, ajuste = new Vetor2d()) {
        this.largura = largura;
        this.altura = altura;
        this.zoom = zoom;
        this.ajuste = ajuste;
        this.bordas = new Bordas2d(new Vetor2d(0, 0), new Vetor2d(this.largura, this.altura));
    }
    mover(x, y) {
        const vetor = new Vetor2d(x, y);
        this.bordas.min.adicV(vetor);
        this.bordas.max.adicV(vetor);
        this.ajuste.adicV(vetor.inv());
    }
}
//# sourceMappingURL=Camera2d.js.map
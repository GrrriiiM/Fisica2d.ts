import { Vetor2d } from "../geometria/Vetor2d.js";
export class Mouse2d {
    constructor() {
        this._posicao = new Vetor2d();
    }
    get posicao() { return this._posicao; }
    set(x, y) {
        this._posicao.set(x, y);
    }
}
//# sourceMappingURL=Mouse2d.js.map
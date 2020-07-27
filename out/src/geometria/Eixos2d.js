import { Vetor2d } from "./Vetor2d.js";
export class Eixo2d extends Vetor2d {
    constructor(vertice1, vertice2) {
        super();
        this.set(vertice2.sub(vertice1).norm().perp());
    }
}
export class Eixos2d extends Array {
    constructor(vertices) {
        super();
        for (let vertice of vertices) {
            this.push(new Eixo2d(vertices.proximo(vertice), vertice));
        }
    }
    rot(rad) {
        this.forEach(_ => _.rotV(rad));
        return this;
    }
}
//# sourceMappingURL=Eixos2d.js.map
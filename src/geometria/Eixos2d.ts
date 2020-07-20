import { Vetor2d } from "./Vetor2d";
import { Vertices2d, Vertice2d } from "./Vertices2d";

export class Eixo2d extends Vetor2d {
    constructor(
        vertice1: Vertice2d,
        vertice2: Vertice2d
    ) {
        super();
        this.set(vertice2.sub(vertice1).norm().perp());
    }
}

export class Eixos2d extends Array<Eixo2d> {
    constructor(vertices: Vertices2d) {
        super();
        for(let vertice of vertices) {
            this.push(new Eixo2d(vertices.proximo(vertice), vertice));
        }
    }

    rot(rad: number): Eixos2d {
        this.forEach(_ => _.rotV(rad));
        return this;
    }
}
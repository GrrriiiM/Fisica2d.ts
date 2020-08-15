import { Vetor2d } from "./Vetor2d.js";
import { Mundo2d } from "../objetos/Mundo2d.js";
export class Vertice2d extends Vetor2d {
    constructor(v, id) {
        super(v.x, v.y);
        this.id = id || Mundo2d.obterProximoVerticeId();
    }
}
export class Vertices2d extends Array {
    constructor(forma, vetores) {
        super();
        vetores.forEach(_ => this.push(new Vertice2d(_)));
    }
    adicV(vetor) {
        this.forEach(_ => _.adicV(vetor));
        return this;
    }
    adic(vetor) {
        let vetores = new Array();
        this.forEach(_ => vetores.push(_.adic(vetor)));
        return vetores;
    }
    subV(vetor) {
        this.forEach(_ => _.subV(vetor));
        return this;
    }
    sub(vetor) {
        let vetores = new Array();
        this.forEach(_ => vetores.push(_.sub(vetor)));
        return vetores;
    }
    rotV(rad, desvio = new Vetor2d()) {
        this.forEach(_ => _.rotV(rad, desvio));
        return this;
    }
    rot(rad, desvio = new Vetor2d()) {
        let vetores = new Array();
        this.forEach(_ => vetores.push(_.rot(rad, desvio)));
        return vetores;
    }
    proximo(vertice) {
        return this[(this.indexOf(vertice) + 1) % this.length];
    }
    anterior(vertice) {
        let indice = this.indexOf(vertice);
        return this[indice - 1 >= 0 ? indice - 1 : this.length - 1];
    }
    contem(ponto) {
        var x = ponto.x;
        var y = ponto.y;
        var inside = false;
        for (var i = 0, j = this.length - 1; i < this.length; j = i++) {
            var xi = this[i].x, yi = this[i].y;
            var xj = this[j].x, yj = this[j].y;
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect)
                inside = !inside;
        }
        return inside;
    }
}
//# sourceMappingURL=Vertices2d.js.map
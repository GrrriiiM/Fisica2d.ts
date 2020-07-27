import { Vetor2d, IReadOnlyVetor2d } from "./Vetor2d";
import { Forma2d } from "./Forma2d";
import { Mundo2d } from "../objetos/Mundo2d";

export class Vertice2d extends Vetor2d {
    id: number;
    constructor(
        v: IReadOnlyVetor2d,
        id?: number
    ) {
        super(v.x, v.y);
        this.id = id || Mundo2d.obterProximoVerticeId();
    }
}

export class Vertices2d extends Array<Vertice2d> {
    
    constructor(forma: Forma2d, vetores: Array<IReadOnlyVetor2d>) {
        super();
        vetores.forEach(_ => this.push(new Vertice2d(_)));
    }

    adicV(vetor: IReadOnlyVetor2d): Vertices2d {
        this.forEach(_ => _.adicV(vetor));
        return this;
    }

    adic(vetor: IReadOnlyVetor2d): IReadOnlyVetor2d[] {
        let vetores = new Array<IReadOnlyVetor2d>();
        this.forEach(_ => vetores.push(_.adic(vetor)));
        return vetores;
    } 

    subV(vetor: IReadOnlyVetor2d): Vertices2d {
        this.forEach(_ => _.subV(vetor));
        return this;
    }

    sub(vetor: IReadOnlyVetor2d): IReadOnlyVetor2d[] {
        let vetores = new Array<IReadOnlyVetor2d>();
        this.forEach(_ => vetores.push(_.sub(vetor)));
        return vetores;
    }

    rotV(rad: number): Vertices2d {
        this.forEach(_ => _.rotV(rad));
        return this;
    }

    rot(rad: number): IReadOnlyVetor2d[] {
        let vetores = new Array<IReadOnlyVetor2d>();
        this.forEach(_ => vetores.push(_.rot(rad)));
        return vetores;
    }

    proximo(vertice: Vertice2d): Vertice2d {
        return this[(this.indexOf(vertice) + 1) % this.length];
    }

    anterior(vertice: Vertice2d): Vertice2d {
        let indice = this.indexOf(vertice);
        return this[indice - 1 >= 0 ? indice - 1 : this.length - 1];
    }

    contem(ponto: Vetor2d): boolean {
        var x = ponto.x; 
        var y = ponto.y;

        var inside = false;
        for (var i = 0, j = this.length - 1; i < this.length; j = i++) {
            var xi = this[i].x, yi = this[i].y;
            var xj = this[j].x, yj = this[j].y;
    
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
    
        return inside;

    }
}
import { Vetor2d } from "./Vetor2d";
import { Vertices2d } from "./Vertices2d";

export class Bordas2d {
    readonly centro = new Vetor2d();
    readonly max = new Vetor2d();
    readonly min = new Vetor2d();
    constructor(vetores: Vertices2d);
    constructor(min: Vetor2d, max: Vetor2d);
    constructor(minX: number, minY: number, maxX: number, maxY: number);
    constructor() {
        this.set(arguments[0], arguments[1], arguments[2], arguments[3]);
    }

    set(vetores: Vertices2d): Bordas2d;
    set(min: Vetor2d, max: Vetor2d): Bordas2d;
    set(minX: number, minY: number, maxX: number, maxY: number): Bordas2d;
    set(): Bordas2d {
        if (arguments[0] instanceof Vertices2d) {
            let vertices = arguments[0] as Vertices2d;
            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE;
            let maxY = Number.MIN_VALUE;
            for(let vertice of vertices) {
                if (vertice.x < minX) minX = vertice.x;
                if (vertice.y < minY) minY = vertice.y;
                if (vertice.x > maxX) maxX = vertice.x;
                if (vertice.y > maxY) maxY = vertice.y;
            }
            this.set(new Vetor2d(minX, minY), new Vetor2d(maxX, maxY));
        } else if (arguments[0] instanceof Vetor2d && arguments[1] instanceof Vetor2d) {
            this.min.set(arguments[0] as Vetor2d);
            this.max.set(arguments[1] as Vetor2d);
        } else if (!Number.isNaN(arguments[0]) 
            && !Number.isNaN(arguments[1])
            && !Number.isNaN(arguments[2]) 
            && !Number.isNaN(arguments[3])) {
            this.min.set(new Vetor2d(arguments[0] as number, arguments[1] as number));
            this.max.set(new Vetor2d(arguments[2] as number, arguments[3] as number));
        }
        this.centro.set(this.max.sub(this.min).div(2).adic(this.min));

        return this;
    }

    sobrepoem(bordas: Bordas2d) {
        return this.min.x <= bordas.max.x && bordas.min.x <= this.max.x
            && this.min.y <= bordas.max.y && bordas.min.y <= this.max.y;
    }

    obterVetores(): Vetor2d[] {
        return [ 
            new Vetor2d(this.min.x, this.min.y), 
            new Vetor2d(this.max.x, this.min.y), 
            new Vetor2d(this.max.x, this.max.y),
            new Vetor2d(this.min.x, this.max.y)
        ];
    }

}
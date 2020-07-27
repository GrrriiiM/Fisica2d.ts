import { Vetor2d } from "./Vetor2d.js";
import { Vertices2d } from "./Vertices2d.js";
export class Bordas2d {
    constructor() {
        this.centro = new Vetor2d();
        this.max = new Vetor2d();
        this.min = new Vetor2d();
        this.set(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    set() {
        if (arguments[0] instanceof Vertices2d) {
            let vertices = arguments[0];
            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = -Number.MAX_VALUE;
            let maxY = -Number.MAX_VALUE;
            for (let vertice of vertices) {
                if (vertice.x < minX)
                    minX = vertice.x;
                if (vertice.y < minY)
                    minY = vertice.y;
                if (vertice.x > maxX)
                    maxX = vertice.x;
                if (vertice.y > maxY)
                    maxY = vertice.y;
            }
            this.set(new Vetor2d(minX, minY), new Vetor2d(maxX, maxY));
        }
        else if (arguments[0] instanceof Vetor2d && arguments[1] instanceof Vetor2d) {
            this.min.set(arguments[0]);
            this.max.set(arguments[1]);
        }
        else if (!Number.isNaN(arguments[0])
            && !Number.isNaN(arguments[1])
            && !Number.isNaN(arguments[2])
            && !Number.isNaN(arguments[3])) {
            this.min.set(new Vetor2d(arguments[0], arguments[1]));
            this.max.set(new Vetor2d(arguments[2], arguments[3]));
        }
        this.centro.set(this.max.sub(this.min).div(2).adic(this.min));
        return this;
    }
    sobrepoem(bordas) {
        return this.min.x <= bordas.max.x && bordas.min.x <= this.max.x
            && this.min.y <= bordas.max.y && bordas.min.y <= this.max.y;
    }
    obterVetores() {
        return [
            new Vetor2d(this.min.x, this.min.y),
            new Vetor2d(this.max.x, this.min.y),
            new Vetor2d(this.max.x, this.max.y),
            new Vetor2d(this.min.x, this.max.y)
        ];
    }
    contem(ponto) {
        var x = ponto.x;
        var y = ponto.y;
        let vetores = [
            { x: this.min.x, y: this.min.y },
            { x: this.max.x, y: this.min.y },
            { x: this.max.x, y: this.max.y },
            { x: this.min.x, y: this.max.y }
        ];
        var inside = false;
        for (var i = 0, j = vetores.length - 1; i < vetores.length; j = i++) {
            var xi = vetores[i].x, yi = vetores[i].y;
            var xj = vetores[j].x, yj = vetores[j].y;
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect)
                inside = !inside;
        }
        return inside;
    }
}
//# sourceMappingURL=Bordas2d.js.map
import { Mundo2d } from "../objetos/Mundo2d.js";
import { Vertices2d } from "./Vertices2d.js";
import { Eixos2d } from "./Eixos2d.js";
import { Bordas2d } from "./Bordas2d.js";
import { Vetor2d } from "./Vetor2d.js";
export class Forma2d {
    constructor(posicao, vetores, opcoes) {
        this.posicao = new Vetor2d();
        this.angulo = 0;
        this.ultimoVerticeId = 0;
        Object.assign(this, opcoes);
        this.id = this.id || Mundo2d.obterProximoFormaId();
        this.nome = this.nome || `forma${this.id}`;
        this.posicao.set(posicao);
        this.vertices = new Vertices2d(this, vetores);
        this.eixos = new Eixos2d(this.vertices);
        this.bordas = new Bordas2d(this.vertices);
        this.area = this._calcularArea();
        this._centralizar();
    }
    obterProximoVerticeId() {
        return this.ultimoVerticeId += 1;
    }
    definir(corpo) {
        this.corpo = corpo;
    }
    _calcularArea(abs = true) {
        let area = 0;
        for (const vertice of this.vertices) {
            area += vertice.cross(this.vertices.proximo(vertice));
        }
        if (!abs)
            return area / 2;
        else
            return Math.abs(area) / 2;
    }
    atualizar(posicao, angulo) {
        const rot = angulo - this.angulo;
        this.vertices.subV(this.posicao).rotV(rot).adicV(posicao);
        this.eixos.rot(rot);
        this.posicao.subV(this.posicao).rotV(rot).adicV(posicao);
        this.bordas.set(this.vertices);
        this.angulo = angulo;
    }
    calcularInercia(densidade) {
        let numerator = 0;
        let denominator = 0;
        for (const vertice of this.vertices) {
            const verticeProximo = this.vertices.proximo(vertice);
            const v1 = vertice.sub(this.posicao);
            const v2 = verticeProximo.sub(this.posicao);
            const cross = Math.abs(v2.cross(v1));
            numerator += cross * (v2.dot(v2) + v2.dot(v1) + v1.dot(v1));
            denominator += cross;
        }
        return ((this.area * densidade) / 6) * (numerator / denominator);
    }
    _centralizar() {
        const centro = new Vetor2d();
        for (const vertice of this.vertices) {
            const proximoVertice = this.vertices.proximo(vertice);
            const cross = vertice.cross(proximoVertice);
            const temp = vertice.adic(proximoVertice).mult(cross);
            centro.adicV(temp);
        }
        let area = this._calcularArea(false);
        centro.divV(area * 6);
        this.vertices.adicV(this.posicao);
        this.vertices.subV(centro);
        this.bordas.set(this.vertices);
    }
}
//# sourceMappingURL=Forma2d.js.map
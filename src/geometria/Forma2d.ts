import { Mundo2d } from "../objetos/Mundo2d";
import { Vertices2d } from "./Vertices2d";
import { Eixos2d } from "./Eixos2d";
import { Bordas2d } from "./Bordas2d";
import { Vetor2d, IReadOnlyVetor2d } from "./Vetor2d";
import { Corpo2d } from "../objetos/Corpo2d";

export interface IForma2dOpcoes{
    
}

export class Forma2d {
    id: number;
    readonly nome: string;
    readonly posicao = new Vetor2d();
    readonly _desvio = new Vetor2d();
    private angulo = 0;
    readonly vertices: Vertices2d;
    readonly bordas: Bordas2d;
    corpo: Corpo2d;
    readonly eixos: Eixos2d;
    readonly area: number;
    private ultimoVerticeId = 0;
    
    constructor(
        posicao: IReadOnlyVetor2d,
        vetores: IReadOnlyVetor2d[],
        opcoes?: IForma2dOpcoes
    ) {
        (<any>Object).assign(this, opcoes);
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

    definirCorpo(corpo: Corpo2d) {
        this.corpo = corpo;
        this._desvio.set(this.posicao);
        this.posicao.set(corpo.posicao);
        this.vertices.adicV(corpo.posicao);
    }

    private _calcularArea(abs: boolean = true) {
        let area = 0;

        for(const vertice of this.vertices) {
            area += vertice.cross(this.vertices.proximo(vertice));
        }

        if (!abs) return area /2;
        else return Math.abs(area) / 2;
    }

    atualizar(posicao: IReadOnlyVetor2d, angulo: number, desvio: IReadOnlyVetor2d = new Vetor2d()) {
        const rot = angulo - this.angulo;
        
        const movimento = posicao.sub(this.posicao);
        this.vertices.rotV(rot, this.posicao.adic(desvio)).adicV(movimento);
        this.eixos.rot(rot);
        this.posicao.set(posicao);
        this.bordas.set(this.vertices);
        this.angulo = angulo;
    }

    public calcularInercia(densidade: number) {
        let numerator = 0;
        let denominator = 0;

        for(const vertice of this.vertices) {
            const verticeProximo = this.vertices.proximo(vertice);
            const v1 = vertice.sub(this.posicao);
            const v2 = verticeProximo.sub(this.posicao);
            const cross = Math.abs(v2.cross(v1));
            numerator += cross * (v2.dot(v2) + v2.dot(v1) + v1.dot(v1));
            denominator += cross;
        }

        return ((this.area * densidade) / 6) * (numerator / denominator);
    }

    private _centralizar() {
        const centro = new Vetor2d();

        for(const vertice of this.vertices) {
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
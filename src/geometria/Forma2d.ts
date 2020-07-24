import { Mundo2d } from "../objetos/Mundo2d";
import { Vertices2d } from "./Vertices2d";
import { Eixos2d } from "./Eixos2d";
import { Bordas2d } from "./Bordas2d";
import { Vetor2d } from "./Vetor2d";
import { Corpo2d } from "../objetos/Corpo2d";

export interface IForma2dOpcoes{
    
}

export class Forma2d {
    id: number;
    readonly nome: string;
    readonly posicao: Vetor2d;
    readonly vertices: Vertices2d;
    readonly bordas: Bordas2d;
    corpo: Corpo2d;
    readonly eixos: Eixos2d;
    readonly area: number;
    private ultimoVerticeId = 0;
    
    constructor(
        posicao: Vetor2d,
        vetores: Vetor2d[],
        opcoes?: IForma2dOpcoes
    ) {
        (<any>Object).assign(this, opcoes);
        this.id = this.id || Mundo2d.obterProximoFormaId();
        this.nome = this.nome || `forma${this.id}`;
        this.posicao = posicao.copia;
        this.vertices = new Vertices2d(this, vetores);
        this.eixos = new Eixos2d(this.vertices);
        this.bordas = new Bordas2d(this.vertices);
        this.area = this._calcularArea();
        this._centralizar();
    }

    obterProximoVerticeId() {
        return this.ultimoVerticeId += 1;
    }

    definir(corpo: Corpo2d) {
        this.corpo = corpo;
    }

    private _calcularArea() {
        let area = 0;

        for(const vertice of this.vertices) {
            area += vertice.cross(this.vertices.proximo(vertice));
        }

        return Math.abs(area) / 2;
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

    private _transformarConvexo(vetores: Array<Vetor2d>): Array<Vetor2d> {
        let baixos = new Array<Vetor2d>();
        let altos = new Array<Vetor2d>();

        vetores = vetores.slice(0).sort((v1, v2) => {
            const v = v1.x - v2.x;
            return v !== 0 ? v : v1.y - v2.y;
        });
    
        for(const vetor of vetores) {
            while(baixos.length >= 2 && Vetor2d.cross3(baixos[baixos.length - 2], baixos[baixos.length - 1], vetor) <= 0)
                baixos.pop();
            baixos.push(vetor);
        }

        for(const vetor of vetores.reverse()) {
            while(altos.length >= 2 && Vetor2d.cross3(altos[altos.length - 2], altos[altos.length - 1], vetor) <= 0)
                altos.pop();
            altos.push(vetor);
        }

        baixos.pop();
        altos.pop();

        return altos.concat(baixos);
    }

    private _centralizar() {
        const centro = new Vetor2d();

        for(const vertice of this.vertices) {
            const proximoVertice = this.vertices.proximo(vertice);
            const cross = vertice.cross(proximoVertice);
            const temp = vertice.adic(proximoVertice).mult(cross);
            centro.adicV(temp);
        }

        centro.divV(this.area * 6);

        this.vertices.subV(this.bordas.max).subV(centro).adicV(this.posicao);
        this.bordas.set(this.vertices);
    }
}
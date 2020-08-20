import { Corpo2d } from "./Corpo2d";
import { IReadOnlyVetor2d, Vetor2d } from "../geometria/Vetor2d";
import { IRenderizacao2dOpcoes } from "../renderizacao/Renderizacao2d";
import { Mundo2d } from "./Mundo2d";

export interface IRestricao2dOpcoes {
    nome?: string,
    pontoA?: IReadOnlyVetor2d,
    pontoB?: IReadOnlyVetor2d,
    corpoA?: Corpo2d,
    corpoB?: Corpo2d,
    anguloA?: number,
    anguloB?: number,
    rigidez?: number,
    rigidezAngular?: number,
    amortecimento?: number,
    tamanho?: number
}

export class Restricao2d {

    static _alerta = 0.4;
    static _torqueAmortecimento = 1;
    static _tamanhoMinimo = 0.000001;

    readonly id: number;
    readonly nome: string;
    readonly corpoA: Corpo2d;
    readonly corpoB: Corpo2d;
    readonly pontoA = new Vetor2d(0,0);
    readonly pontoB = new Vetor2d(0,0);
    private _anguloA: number;
    private _anguloB: number;
    readonly rigidez: number;
    readonly rigidezAngular: number;
    readonly amortecimento: number;
    readonly tamanho: number;
    private _massaTotal: number;
    get massaTotal() { return this._massaTotal; }
    private _velocidadeNorma = 0;
    get velocidadeNorma() { return this._velocidadeNorma; }
    private _resistenciaTotal = 0;
    get resistenciaTotal() { return this._resistenciaTotal}
    private _forca = new Vetor2d();
    get forca(): IReadOnlyVetor2d { return this._forca; }
    private _norma = new Vetor2d();
    get norma(): IReadOnlyVetor2d { return this._norma; }
    get mundoPontoA() { return this.corpoA ? this.pontoA.adic(this.corpoA.posicao) : this.pontoA }
    get mundoPontoB() { return this.corpoB ? this.pontoB.adic(this.corpoB.posicao) : this.pontoB }
    constructor(
        opcoes: IRestricao2dOpcoes = {}
    ) {
        const op = opcoes ?? {};
        this.id = Mundo2d.obterProximoCorpoId();
        this.nome = op.nome ?? `restricao${Mundo2d.obterProximoCorpoId}`;
        this.pontoA.set(op.pontoA ?? new Vetor2d());
        this.pontoB.set(op.pontoB ?? new Vetor2d());
        this.corpoA = op.corpoA;
        this.corpoB = op.corpoB;
        this._anguloA = this.corpoA ? this.corpoA.angulo : (op.anguloA ?? 0);
        this._anguloB = this.corpoB ? this.corpoB.angulo : (op.anguloB ?? 0);
        this.tamanho = op.tamanho ?? 0;
        this.rigidez = op.rigidez ?? (this.tamanho > 0 ? 1 : 0.7);
        this.rigidezAngular = op.rigidezAngular ?? 0;
        this.amortecimento = op.amortecimento ?? 0;
    }

    resolver(tempoEscala: number) {

        let pontoA = this.pontoA;
        let pontoB = this.pontoB;

        if (!this.corpoA && !this.corpoB) return;

        if (this.corpoA && !this.corpoA.estatico) {
            pontoA.rotV(this.corpoA.angulo - this._anguloA);
            this._anguloA = this.corpoA.angulo;
        }

        if (this.corpoB && !this.corpoB.estatico) {
            pontoB.rotV(this.corpoB.angulo - this._anguloB);
            this._anguloB = this.corpoB.angulo;
        }

        const mundoPontoA = pontoA.copia;
        const mundoPontoB = pontoB.copia;

        if (this.corpoA) mundoPontoA.adicV(this.corpoA.posicao);
        if (this.corpoB) mundoPontoB.adicV(this.corpoB.posicao);

        const delta = mundoPontoA.sub(mundoPontoB);
        let tamanhoAtual = delta.mag;

        if (tamanhoAtual < Restricao2d._tamanhoMinimo) tamanhoAtual = Restricao2d._tamanhoMinimo;
        
        const diferenca = (tamanhoAtual - this.tamanho) / tamanhoAtual;
        const rigidez = this.rigidez < 1 ? this.rigidez * tempoEscala : this.rigidez;
        this._forca.set(delta.mult(diferenca * rigidez));
        this._massaTotal = (this.corpoA ? this.corpoA.massaInvertida : 0) + (this.corpoB ? this.corpoB.massaInvertida : 0);
        const inerciaTotal  = (this.corpoA ? this.corpoA.inerciaInvertida : 0) + (this.corpoB ? this.corpoB.inerciaInvertida : 0);
        this._resistenciaTotal = this._massaTotal + inerciaTotal;

        if (this.amortecimento) {
            this._norma.set(delta.div(tamanhoAtual));
            const velocidadeA = this.corpoA ? this.corpoA.velocidade : new Vetor2d();
            const velocidadeB = this.corpoB ? this.corpoB.velocidade : new Vetor2d();
            const velocidadeRelativa = velocidadeB.sub(velocidadeA);
            this._velocidadeNorma = this._norma.dot(velocidadeRelativa);
        }

        if (this.corpoA) this.corpoA.aplicarRestricao(pontoA, this);
        if (this.corpoB) this.corpoB.aplicarRestricao(pontoB, this);

    }
}
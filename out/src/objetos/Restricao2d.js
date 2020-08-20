import { Vetor2d } from "../geometria/Vetor2d.js";
import { Mundo2d } from "./Mundo2d.js";
export class Restricao2d {
    constructor(opcoes = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.pontoA = new Vetor2d(0, 0);
        this.pontoB = new Vetor2d(0, 0);
        this._velocidadeNorma = 0;
        this._resistenciaTotal = 0;
        this._forca = new Vetor2d();
        this._norma = new Vetor2d();
        const op = opcoes !== null && opcoes !== void 0 ? opcoes : {};
        this.id = Mundo2d.obterProximoCorpoId();
        this.nome = (_a = op.nome) !== null && _a !== void 0 ? _a : `restricao${Mundo2d.obterProximoCorpoId}`;
        this.pontoA.set((_b = op.pontoA) !== null && _b !== void 0 ? _b : new Vetor2d());
        this.pontoB.set((_c = op.pontoB) !== null && _c !== void 0 ? _c : new Vetor2d());
        this.corpoA = op.corpoA;
        this.corpoB = op.corpoB;
        this._anguloA = this.corpoA ? this.corpoA.angulo : ((_d = op.anguloA) !== null && _d !== void 0 ? _d : 0);
        this._anguloB = this.corpoB ? this.corpoB.angulo : ((_e = op.anguloB) !== null && _e !== void 0 ? _e : 0);
        this.tamanho = (_f = op.tamanho) !== null && _f !== void 0 ? _f : 0;
        this.rigidez = (_g = op.rigidez) !== null && _g !== void 0 ? _g : (this.tamanho > 0 ? 1 : 0.7);
        this.rigidezAngular = (_h = op.rigidezAngular) !== null && _h !== void 0 ? _h : 0;
        this.amortecimento = (_j = op.amortecimento) !== null && _j !== void 0 ? _j : 0;
    }
    get massaTotal() { return this._massaTotal; }
    get velocidadeNorma() { return this._velocidadeNorma; }
    get resistenciaTotal() { return this._resistenciaTotal; }
    get forca() { return this._forca; }
    get norma() { return this._norma; }
    get mundoPontoA() { return this.corpoA ? this.pontoA.adic(this.corpoA.posicao) : this.pontoA; }
    get mundoPontoB() { return this.corpoB ? this.pontoB.adic(this.corpoB.posicao) : this.pontoB; }
    resolver(tempoEscala) {
        let pontoA = this.pontoA;
        let pontoB = this.pontoB;
        if (!this.corpoA && !this.corpoB)
            return;
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
        if (this.corpoA)
            mundoPontoA.adicV(this.corpoA.posicao);
        if (this.corpoB)
            mundoPontoB.adicV(this.corpoB.posicao);
        const delta = mundoPontoA.sub(mundoPontoB);
        let tamanhoAtual = delta.mag;
        if (tamanhoAtual < Restricao2d._tamanhoMinimo)
            tamanhoAtual = Restricao2d._tamanhoMinimo;
        const diferenca = (tamanhoAtual - this.tamanho) / tamanhoAtual;
        const rigidez = this.rigidez < 1 ? this.rigidez * tempoEscala : this.rigidez;
        this._forca.set(delta.mult(diferenca * rigidez));
        this._massaTotal = (this.corpoA ? this.corpoA.massaInvertida : 0) + (this.corpoB ? this.corpoB.massaInvertida : 0);
        const inerciaTotal = (this.corpoA ? this.corpoA.inerciaInvertida : 0) + (this.corpoB ? this.corpoB.inerciaInvertida : 0);
        this._resistenciaTotal = this._massaTotal + inerciaTotal;
        if (this.amortecimento) {
            this._norma.set(delta.div(tamanhoAtual));
            const velocidadeA = this.corpoA ? this.corpoA.velocidade : new Vetor2d();
            const velocidadeB = this.corpoB ? this.corpoB.velocidade : new Vetor2d();
            const velocidadeRelativa = velocidadeB.sub(velocidadeA);
            this._velocidadeNorma = this._norma.dot(velocidadeRelativa);
        }
        if (this.corpoA)
            this.corpoA.aplicarRestricao(pontoA, this);
        if (this.corpoB)
            this.corpoB.aplicarRestricao(pontoB, this);
    }
}
Restricao2d._alerta = 0.4;
Restricao2d._torqueAmortecimento = 1;
Restricao2d._tamanhoMinimo = 0.000001;
//# sourceMappingURL=Restricao2d.js.map
import { Vetor2d } from "../geometria/Vetor2d.js";
import { Mundo2d } from "./Mundo2d.js";
export class Corpo2d {
    constructor(posicao, formas, opcoes = {}) {
        this._formas = new Array();
        this._movimento = 0;
        this._posicao = new Vetor2d();
        this._prePosicao = new Vetor2d();
        this._angulo = 0;
        this._preAngulo = 0;
        this._torque = 0;
        this._contatosQuantidade = 0;
        this._rapidez = 0;
        this._velocidade = new Vetor2d();
        this._velocidadeAngular = 0;
        this._rapidezAngular = 0;
        this._forca = new Vetor2d();
        this._correcaoPosicao = new Vetor2d();
        this._restituicao = 0;
        this._despejo = 0.05;
        this._friccao = 0.1;
        this._friccaoEstatica = 0.5;
        this._friccaoAr = 0.01;
        this._densidade = 0.001;
        this._area = 0;
        this._massa = 0;
        this._inercia = 0;
        this._sensor = false;
        this._dormindo = false;
        this._dormindoContador = 0;
        this._dormindoContadorLimite = 60;
        this._tempoEscala = 1;
        this._estatico = false;
        this._massaNaoEstatico = 0;
        this._inerciaNaoEstatico = 0;
        this._id = Mundo2d.obterProximoCorpoId();
        this._nome = `corpo${this._id}`;
        for (const forma of formas) {
            forma.definir(this);
            this._formas.push(forma);
        }
        this.setPosicao(posicao);
        this.setOpcoes(opcoes);
        this._prePosicao.set(this._posicao);
        this._preAngulo = this._angulo;
    }
    get nome() { return this._nome; }
    get formas() { return this._formas; }
    get movimento() { return this._movimento; }
    get posicao() { return this._posicao; }
    get prePosicao() { return this._prePosicao; }
    get angulo() { return this._angulo; }
    get preAngulo() { return this._preAngulo; }
    set preAngulo(v) { this._preAngulo = v; }
    get contatosQuantidade() { return this._contatosQuantidade; }
    set contatosQuantidade(v) { this._contatosQuantidade = v; }
    get rapidez() { return this._rapidez; }
    get velocidade() { return this._posicao.sub(this._prePosicao); }
    get velocidadeAngular() { return this._velocidadeAngular; }
    get rapidezAngular() { return this._rapidezAngular; }
    get correcaoPosicao() { return this._correcaoPosicao; }
    get restituicao() { return this._restituicao; }
    get despejo() { return this._despejo; }
    get friccao() { return this._friccao; }
    get friccaoEstatica() { return this._friccaoEstatica; }
    get massa() { return this._massa; }
    get massaInvertida() { return this._massa == 0 ? Infinity : this._massa == Infinity ? 0 : 1 / this._massa; }
    get inerciaInvertida() { return this._inercia == 0 ? Infinity : this._inercia == Infinity ? 0 : 1 / this._inercia; }
    get estatico() { return this._estatico; }
    get dormindo() { return this._dormindo; }
    setOpcoes(opcoes) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const op = opcoes !== null && opcoes !== void 0 ? opcoes : {};
        this.setAngulo((_a = op.angulo) !== null && _a !== void 0 ? _a : this._angulo);
        this.setDensidade((_b = op.densidade) !== null && _b !== void 0 ? _b : this._densidade);
        this.setEstatico((_c = op.estatico) !== null && _c !== void 0 ? _c : this._estatico);
        this.setDormindo((_d = op.dormindo) !== null && _d !== void 0 ? _d : this._dormindo);
        this._restituicao = (_e = op.restituicao) !== null && _e !== void 0 ? _e : this.restituicao;
        this._friccao = (_f = op.friccao) !== null && _f !== void 0 ? _f : this._friccao;
        this._friccaoEstatica = (_g = op.friccaoEstatica) !== null && _g !== void 0 ? _g : this._friccaoEstatica;
        this._despejo = (_h = op.despejo) !== null && _h !== void 0 ? _h : this._despejo;
        this._nome = (_j = op.nome) !== null && _j !== void 0 ? _j : this._nome;
    }
    setDensidade(densidade) {
        this._densidade = densidade;
        this._area = this._formas.reduce((a, c) => a += c.area, 0);
        this._massaNaoEstatico = this._area * this._densidade;
        this._inerciaNaoEstatico = this._formas.reduce((a, c) => a += c.calcularInercia(this._densidade) * 4, 0);
        if (this.estatico) {
            this._massa = Infinity;
            this._inercia = Infinity;
        }
        else {
            this._massa = this._massaNaoEstatico;
            this._inercia = this._inerciaNaoEstatico;
        }
    }
    setEstatico(estatico) {
        this._estatico = estatico;
        this.setDensidade(this._densidade);
    }
    setDormindo(dormindo) {
        if (dormindo) {
            this._dormindo = true;
            this._dormindoContador = this._dormindoContadorLimite;
            this._correcaoPosicao.set(0, 0);
            this._prePosicao.set(this.posicao);
            this._preAngulo = this._angulo;
            this._rapidez = 0;
            this._rapidezAngular = 0;
            this._movimento = 0;
        }
        else {
            this._dormindo = false;
            this._dormindoContador = 0;
        }
    }
    setAngulo(angulo) {
        this._angulo = angulo;
        this._atualizarFormas();
    }
    setPosicao(posicao) {
        this._posicao.set(posicao);
        this._atualizarFormas();
    }
    _atualizarFormas() {
        for (const forma of this._formas) {
            forma.atualizar(this._posicao, this._angulo);
        }
    }
    _resolverVelocidade(delta, tempoEscala, correcao) {
        const deltaQuadrado = Math.pow(delta * tempoEscala * this._tempoEscala, 2);
        const friccaoAr = 1 - this._friccaoAr * tempoEscala * this._tempoEscala;
        const preVelocidade = this._posicao.sub(this._prePosicao);
        this._velocidade.set(preVelocidade.mult(friccaoAr * correcao).adic(this._forca.div(this._massa).mult(deltaQuadrado)));
        this._rapidez = this._velocidade.mag;
        this._prePosicao.set(this._posicao);
        this.setPosicao(this._posicao.adic(this._velocidade));
    }
    _resolverVelocidadeAngular(delta, tempoEscala, correcao) {
        const deltaQuadrado = Math.pow(delta * tempoEscala * this._tempoEscala, 2);
        const friccaoAr = 1 - this._friccaoAr * tempoEscala * this._tempoEscala;
        this._velocidadeAngular = ((this._angulo - this._preAngulo) * friccaoAr * correcao) + (this._torque / this._inercia) * deltaQuadrado;
        this._rapidezAngular = Math.abs(this._velocidadeAngular);
        this._preAngulo = this._angulo;
        this.setAngulo(this._angulo + this._velocidadeAngular);
    }
    atualizar(delta, tempoEscala, correcao) {
        this._resolverVelocidade(delta, tempoEscala, correcao);
        this._resolverVelocidadeAngular(delta, tempoEscala, correcao);
    }
    adicionarForca(forca) {
        this._forca.adicV(forca);
    }
    adicionarCorrecaoPosicao(norma, correcao) {
        if (!this._estatico && !this._dormindo) {
            this._correcaoPosicao.adicV(norma.mult(correcao * (0.9 / this._contatosQuantidade)));
        }
    }
    ajustarColisao() {
        this._contatosQuantidade = 0;
        if (this._correcaoPosicao.x !== 0 || this._correcaoPosicao.y !== 0) {
            this.setPosicao(this._posicao.adic(this._correcaoPosicao));
            this._prePosicao.adicV(this._correcaoPosicao);
            if (this._correcaoPosicao.dot(this._velocidade) < 0) {
                this._correcaoPosicao.set(0, 0);
            }
            else {
                this._correcaoPosicao.mult(0.8);
            }
        }
    }
    verificarDormindo(tempoEscala) {
        const tempoFator = tempoEscala * tempoEscala * tempoEscala;
        const movimento = this._rapidez * this._rapidez + this._rapidezAngular * this._rapidezAngular;
        if (this._forca.x != 0 || this._forca.y != 0) {
            this.setDormindo(false);
        }
        const minMovimento = Math.min(this._movimento, movimento);
        const maxMovimento = Math.max(this._movimento, movimento);
        this._movimento = 0.9 * minMovimento + 0.1 * maxMovimento;
        if (this._dormindoContadorLimite > 0 && this._movimento < 0.08 * tempoFator) {
            this._dormindoContador += 1;
            if (this._dormindoContador >= this._dormindoContadorLimite) {
                this.setDormindo(true);
            }
        }
        else if (this._dormindoContador > 0) {
            this._dormindoContador = 0;
        }
    }
    resetar() {
        this._forca.set(0, 0);
        this._torque = 0;
    }
}
//# sourceMappingURL=Corpo2d.js.map
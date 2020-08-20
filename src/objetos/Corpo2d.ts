
import { Vetor2d, IReadOnlyVetor2d } from "../geometria/Vetor2d";
import { Mundo2d } from "./Mundo2d";
import { Forma2d } from "../geometria/Forma2d";
import { Utilidades } from "../nucleo/Utilidades";
import { Restricao2d } from "./Restricao2d";

export interface ICorpo2dOpcoes{
    nome?: string,
    estatico?: boolean,
    dormindo?: boolean,
    angulo?: number,
    densidade?: number,
    restituicao?: number,
    friccao?: number,
    friccaoEstatica?: number,
    fricicaoAr?: number,
    despejo?: number,
    inercia?: number
}

export class Corpo2d {

    private _id: number;
    private _nome: string;
    get nome() { return this._nome; }

    private _formas = new Array<Forma2d>();
    get formas(): ReadonlyArray<Forma2d> { return this._formas; }

    private _movimento = 0;
    get movimento() { return this._movimento; }
    private _posicao = new Vetor2d();
    get posicao(): IReadOnlyVetor2d { return this._posicao; }
    private _prePosicao = new Vetor2d();
    get prePosicao(): Vetor2d { return this._prePosicao; }
    private _angulo = 0;
    get angulo(): number { return this._angulo; }
    private _preAngulo = 0;
    get preAngulo(): number { return this._preAngulo; }
    set preAngulo(v) { this._preAngulo = v; }
    private _torque = 0;
    
    private _contatosQuantidade = 0;
    get contatosQuantidade() { return this._contatosQuantidade; }
    set contatosQuantidade(v: number) { this._contatosQuantidade=v; }
    
    private _rapidez = 0;
    get rapidez(): number { return this._rapidez; }
    private _velocidade = new Vetor2d();
    get velocidade(): IReadOnlyVetor2d { return this._posicao.sub(this._prePosicao); }
    private _velocidadeAngular = 0;
    get velocidadeAngular() { return this._velocidadeAngular; }
    private _rapidezAngular = 0;
    get rapidezAngular(): number { return this._rapidezAngular; }

    private _forca = new Vetor2d();
    private _correcaoPosicao = new Vetor2d();
    get correcaoPosicao(): IReadOnlyVetor2d { return this._correcaoPosicao; }
    
    private _restituicao = 0;
    get restituicao(): number { return this._restituicao; }
    private _despejo = 0.05;
    get despejo(): number { return this._despejo; }

    private _friccao = 0.1;
    get friccao(): number { return this._friccao; }
    private _friccaoEstatica = 0.5;
    get friccaoEstatica(): number { return this._friccaoEstatica; }
    private _friccaoAr = 0.01;

    private _densidade = 0.001;
    private _area = 0;
    private _massa = 0;
    get massa(): number { return this._massa; }
    get massaInvertida(): number { return this._massa == 0 ? Infinity : this._massa == Infinity ? 0 : 1/this._massa; }
    private _inercia = 0;
    get inerciaInvertida(): number { return this._inercia == 0 ? Infinity : this._inercia == Infinity ? 0 : 1/this._inercia; }

    private _sensor = false;
    
    get estatico() { return this._estatico; }
    private _dormindo = false;
    get dormindo() { return this._dormindo; }
    private _dormindoContador = 0;
    readonly _dormindoContadorLimite = 180;
    
    private _tempoEscala = 1;

    private _estatico = false;
    private _massaNaoEstatico = 0;
    private _inerciaNaoEstatico = 0;

    private _restricao = new Vetor2d();
    get restricao(): IReadOnlyVetor2d { return this._restricao; }

    private _restricaoAngulo: number = 0;
    get restricaoAngulo(): number { return this._restricaoAngulo; }
    private _desvioRestricao = new Vetor2d();

    constructor(
        posicao: Vetor2d,
        formas: Forma2d[],
        opcoes: ICorpo2dOpcoes = {}
    ) {
        this._id = Mundo2d.obterProximoCorpoId();
        this._nome = `corpo${this._id}`;
        this._posicao.set(posicao);
        for(const forma of formas) {
            forma.definirCorpo(this);
            this._formas.push(forma);
        }
        this.setPosicao(posicao);
        this.setOpcoes(opcoes);
        this._prePosicao.set(this._posicao);
        this._preAngulo = this._angulo;
    }

    public setOpcoes(opcoes: ICorpo2dOpcoes) {
        const op = opcoes ?? {};
        this.setAngulo(op.angulo ?? this._angulo);
        this.setDensidade(op.densidade ?? this._densidade);
        this.setEstatico(op.estatico ?? this._estatico);
        this.setDormindo(op.dormindo ?? this._dormindo);
        this._restituicao = op.restituicao ?? this.restituicao;
        this._friccao = op.friccao ?? this._friccao;
        this._friccaoEstatica = op.friccaoEstatica ?? this._friccaoEstatica;
        this._despejo = op.despejo ?? this._despejo;
        this._friccaoAr = op.fricicaoAr ?? this._friccaoAr;
        this._inercia = op.inercia ?? this._inercia;
        this._nome = op.nome ?? this._nome;
    }

    public setDensidade(densidade: number) {
        this._densidade = densidade;
        this._area = this._formas.reduce((a,c) => a+=c.area, 0);
        this._massaNaoEstatico = this._area * this._densidade;
        this._inerciaNaoEstatico = this._formas.reduce((a, c) => a+=c.calcularInercia(this._densidade)*4, 0);
        if (this.estatico) {
            this._massa = Infinity;
            this._inercia = Infinity;
        } else {
            this._massa = this._massaNaoEstatico;
            this._inercia = this._inerciaNaoEstatico;
        }
    }



    public setEstatico(estatico: boolean) {
        this._estatico = estatico;
        this.setDensidade(this._densidade);
    }

    public setDormindo(dormindo: boolean) {
        if (dormindo) {
            this._dormindo = true;
            this._dormindoContador = this._dormindoContadorLimite;

            this._correcaoPosicao.set(0, 0);
            this._prePosicao.set(this.posicao);

            this._preAngulo = this._angulo;
            this._rapidez = 0
            this._rapidezAngular = 0
            this._movimento = 0;
        } else {
            this._dormindo = false;
            this._dormindoContador = 0
        }
    }

    public setAngulo(angulo: number, desvio: IReadOnlyVetor2d = new Vetor2d()) {
        this._angulo = angulo;
        this._atualizarFormas(desvio);
    }

    public setPosicao(posicao: IReadOnlyVetor2d) {
        this._posicao.set(posicao);
        this._atualizarFormas();
    }

    private _atualizarFormas(desvio: IReadOnlyVetor2d = new Vetor2d()) {
        for(const forma of this._formas) {
            forma.atualizar(this._posicao, this._angulo, desvio);
        }
    }

    private _resolverVelocidade(delta: number, tempoEscala: number, correcao: number) {
        const deltaQuadrado = Math.pow(delta * tempoEscala * this._tempoEscala, 2);
        const friccaoAr = 1 - this._friccaoAr * tempoEscala * this._tempoEscala;
        const preVelocidade = this._posicao.sub(this._prePosicao);
        this._velocidade.set(preVelocidade.mult(friccaoAr*correcao).adic(this._forca.div(this._massa).mult(deltaQuadrado)));
        this._rapidez = this._velocidade.mag;
        this._prePosicao.set(this._posicao);
        this.setPosicao(this._posicao.adic(this._velocidade));
        
    }

    private _resolverVelocidadeAngular(delta: number, tempoEscala: number, correcao: number) {
        const deltaQuadrado = Math.pow(delta * tempoEscala * this._tempoEscala, 2);
        const friccaoAr = 1 - this._friccaoAr * tempoEscala * this._tempoEscala;
        this._velocidadeAngular = ((this._angulo - this._preAngulo) * friccaoAr * correcao) + (this._torque/this._inercia) * deltaQuadrado
        this._rapidezAngular = Math.abs(this._velocidadeAngular);
        this._preAngulo = this._angulo;
        this.setAngulo(this._angulo + this._velocidadeAngular);
    } 

    atualizar(delta: number, tempoEscala: number, correcao: number) {
        this._resolverVelocidade(delta, tempoEscala, correcao);
        this._resolverVelocidadeAngular(delta, tempoEscala, correcao);
    }

    adicionarForca(forca: IReadOnlyVetor2d) {
        this._forca.adicV(forca);
    }

    adicionarCorrecaoPosicao(norma: IReadOnlyVetor2d, correcao: number) {
        if (!this._estatico && !this._dormindo) {
            this._correcaoPosicao.adicV(norma.mult(correcao * (0.9 / this._contatosQuantidade)));
        }
    }

    ajustarColisao() {
        this._contatosQuantidade = 0
        if (this._correcaoPosicao.x !== 0 || this._correcaoPosicao.y !== 0) {
            this.setPosicao(this._posicao.adic(this._correcaoPosicao))
            this._prePosicao.adicV(this._correcaoPosicao);
            if (this._correcaoPosicao.dot(this._velocidade) < 0) {
                this._correcaoPosicao.set(0, 0);
            } else {
                this._correcaoPosicao.mult(0.8);
            }
        }
    }

    verificarDormindo(tempoEscala: number) {
        if (this._estatico) return;
        const tempoFator = tempoEscala * tempoEscala * tempoEscala;
        const movimento = this._rapidez * this._rapidez + this._rapidezAngular * this._rapidezAngular;
        
        if (this._forca.x != 0 || this._forca.y != 0) {
            this.setDormindo(false);
        }

        const minMovimento = Math.min(this._movimento, movimento);
        const maxMovimento = Math.max(this._movimento, movimento);
        
        this._movimento = 0.9 * minMovimento + 0.1*maxMovimento;

        if (this._dormindoContadorLimite > 0 && this._movimento < 0.02 * tempoFator) {
            this._dormindoContador += 1;
            if (this._dormindoContador >= this._dormindoContadorLimite) {
                this.setDormindo(true);
            }
        } else if (this._dormindoContador > 0) {
            this._dormindoContador = 0
        }
    }

    prepararRestricao() {
        if (this.estatico || (this.restricao.x == 0 && this.restricao.y == 0 && this.restricaoAngulo == 0)) return;

        this.setPosicao(this.posicao.adic(this.restricao));
        this.setAngulo(this._angulo + this.restricaoAngulo);
        this._restricao.multV(0.4);
        this._restricaoAngulo *= 0.4;
    }

    aplicarRestricao(ponto: IReadOnlyVetor2d, restricao: Restricao2d) {
        if (this.estatico) return;
        //this._desvioRestricao.set(ponto);
        const compartilhado = this.massaInvertida / restricao.massaTotal;
        this._restricao.subV(restricao.forca.mult(compartilhado));
        
        if (restricao.amortecimento) {
            this.prePosicao.subV(restricao.norma.mult(restricao.amortecimento * restricao.velocidadeNorma * compartilhado));
        }
        let torque = (ponto.cross(restricao.forca) / restricao.resistenciaTotal); 
        torque *= Restricao2d._torqueAmortecimento;
        torque *= this.inerciaInvertida;
        torque *= (1 - restricao.rigidezAngular);
        this._restricaoAngulo -= torque; 
        
        //this.setPosicao(this.posicao.adic(ponto));
        var desvio = new Vetor2d(-ponto.x, -ponto.y);
        desvio.rotV(this._restricaoAngulo);
        desvio.adicV(ponto);
        desvio.adicV(this._posicao.sub(restricao.forca.mult(compartilhado)));
        
        var angulo = this.angulo;
        //this.setAngulo(this._restricaoAngulo, ponto);
        this.setPosicao(desvio);
        this.setAngulo(angulo - torque, this.restricao);
    }

    resetar() {
        this._forca.set(0, 0);
        this._torque = 0;
    }


}


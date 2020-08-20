import { Corpo2d } from "./Corpo2d.js";
import { Vetor2d } from "../geometria/Vetor2d.js";
import { Construtor2d } from "../geometria/Construtor2d.js";
import { Area2d } from "../colisao/Area2d.js";
import { Restricao2d } from "./Restricao2d.js";
import { Mouse2d } from "./Mouse2d.js";
export class Mundo2d {
    constructor(largura, altura, opcoes) {
        var _a;
        this.largura = largura;
        this.altura = altura;
        this._corpos = new Array();
        this._restricoes = new Array();
        this.gravidade = new Vetor2d();
        this.gravidadeEscala = 1;
        this.tamanhoArea = 48;
        this.areas = new Array();
        this.pares = {};
        this.mouse = new Mouse2d();
        const op = opcoes !== null && opcoes !== void 0 ? opcoes : {};
        this._corpos = (_a = op.corpos) !== null && _a !== void 0 ? _a : new Array();
        this.gravidade.set(op.gravidade || this.gravidade);
        this.gravidadeEscala = op.gravidadeEscala || this.gravidadeEscala;
        this.tamanhoArea = op.tamanhoArea || this.tamanhoArea;
        if (op.paredes && op.paredes.length == 1) {
            op.paredes = [op.paredes[0], op.paredes[0], op.paredes[0], op.paredes[0]];
            this._adicionarParedes(op.paredes[0], op.paredes[1], op.paredes[2], op.paredes[3], op.friccaoParedes);
        }
        this._criarAreas(this.tamanhoArea);
    }
    get corpos() { return this._corpos; }
    get restricoes() { return this._restricoes; }
    adicionarCorpo(arg1, arg2, arg3, arg4) {
        if (arg1 instanceof Corpo2d)
            return this._adicionarCorpo1(arg1);
        else
            return this._adicionarCorpo2(arg1, arg2, arg3, arg4);
    }
    _adicionarCorpo1(corpo) {
        this._corpos.push(corpo);
        return corpo;
    }
    _adicionarCorpo2(x, y, formas, opcoes) {
        return this._adicionarCorpo1(Construtor2d.Corpo(x, y, formas, opcoes));
    }
    adicionarRestricao(arg1) {
        if (arg1 instanceof Restricao2d)
            return this._adicionarRestricao1(arg1);
        else
            return this._adicionarRestricao2(arg1);
    }
    _adicionarRestricao1(restricao) {
        this._restricoes.push(restricao);
        return restricao;
    }
    _adicionarRestricao2(opcoes) {
        return this._adicionarRestricao1(new Restricao2d(opcoes));
    }
    _adicionarParedes(esquerda, baixo, direita, cima, friccao) {
        if (esquerda) {
            this.adicionarCorpo(Construtor2d.Corpo(this.largura, this.altura / 2, [Construtor2d.Retangulo(50, this.altura)], { estatico: true, friccao: friccao }));
        }
        if (baixo) {
            this.adicionarCorpo(Construtor2d.Corpo(this.largura / 2, this.altura, [Construtor2d.Retangulo(this.largura, 50)], { estatico: true, friccao: friccao }));
        }
        if (direita) {
            this.adicionarCorpo(Construtor2d.Corpo(0, this.altura / 2, [Construtor2d.Retangulo(50, this.altura)], { estatico: true, friccao: friccao }));
        }
        if (cima) {
            this.adicionarCorpo(Construtor2d.Corpo(this.largura / 2, 0, [Construtor2d.Retangulo(this.largura, 50)], { estatico: true, friccao: friccao }));
        }
    }
    _criarAreas(tamanhoArea) {
        if (tamanhoArea == 0) {
            tamanhoArea = Math.floor(this.largura > this.altura ? this.largura / 20 : this.altura / 20);
        }
        for (let l = 0; l * tamanhoArea < this.altura; l++) {
            for (let c = 0; c * tamanhoArea < this.largura; c++) {
                this.areas.push(new Area2d(l, c, tamanhoArea));
            }
        }
    }
    atualizarMouse(x, y, click1, click2) {
        this.mouse.set(x, y);
        let restricao = this.restricoes.find(_ => _.nome == "___mouse1");
        if (restricao) {
            if (click1 && this.mouse.corpo) {
                this.mouse.corpo.setDormindo(false);
                restricao.pontoB.set(x, y);
                return;
            }
            else {
                this._restricoes.splice(this._restricoes.indexOf(restricao));
            }
        }
        for (let corpo of this.corpos) {
            if (!corpo.estatico) {
                for (let forma of corpo.formas) {
                    if (forma.vertices.contem(this.mouse.posicao)) {
                        this.mouse.corpo = corpo;
                        if (click1) {
                            corpo.setDormindo(false);
                            let ponto = this.mouse.posicao.sub(this.mouse.corpo.posicao);
                            restricao = new Restricao2d({
                                nome: "___mouse1",
                                corpoA: this.mouse.corpo,
                                pontoA: ponto,
                                pontoB: this.mouse.posicao,
                                tamanho: 0.01,
                                rigidez: 0.1,
                                rigidezAngular: 1
                            });
                            this._restricoes.push(restricao);
                        }
                        return;
                    }
                }
            }
        }
        this.mouse.corpo = null;
    }
    static obterProximoCorpoId() {
        this._ultimoCorpoId += 1;
        return this._ultimoCorpoId;
    }
    static obterProximoFormaId() {
        this._ultimoFormaId += 1;
        return this._ultimoFormaId;
    }
    static obterProximoVerticeId() {
        this._ultimoVerticeId += 1;
        return this._ultimoVerticeId;
    }
}
Mundo2d._ultimoCorpoId = 0;
Mundo2d._ultimoFormaId = 0;
Mundo2d._ultimoVerticeId = 0;
//# sourceMappingURL=Mundo2d.js.map
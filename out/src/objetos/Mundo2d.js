import { Vetor2d } from "../geometria/Vetor2d.js";
import { Construtor2d } from "../geometria/Construtor2d.js";
import { Area2d } from "../colisao/Area2d.js";
export class Mundo2d {
    constructor(largura, altura, opcoes) {
        var _a;
        this.largura = largura;
        this.altura = altura;
        this._corpos = new Array();
        this.gravidade = new Vetor2d();
        this.gravidadeEscala = 1;
        this.tamanhoArea = 48;
        this.areas = new Array();
        this.pares = {};
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
    adicionarCorpo(corpo) {
        this._corpos.push(corpo);
        return corpo;
    }
    _adicionarParedes(esquerda, baixo, direita, cima, friccao) {
        if (esquerda) {
            this.adicionarCorpo(Construtor2d.Retangulo(this.largura, this.altura / 2, 50, this.altura, { estatico: true, friccao: friccao }));
        }
        if (baixo) {
            this.adicionarCorpo(Construtor2d.Retangulo(this.largura / 2, this.altura, this.largura, 50, { estatico: true, friccao: friccao }));
        }
        if (direita) {
            this.adicionarCorpo(Construtor2d.Retangulo(0, this.altura / 2, 50, this.altura, { estatico: true, friccao: friccao }));
        }
        if (cima) {
            this.adicionarCorpo(Construtor2d.Retangulo(this.largura / 2, 0, this.largura, 50, { estatico: true, friccao: friccao }));
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
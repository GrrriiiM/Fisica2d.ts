import { Corpo2d } from "./Corpo2d";
import { Vetor2d, IReadOnlyVetor2d } from "../geometria/Vetor2d";
import { Construtor2d } from "../geometria/Construtor2d";
import { Area2d } from "../colisao/Area2d";
import { Par2d } from "../colisao/Pares2d";


export interface IMundo2dOpcoes {
    corpos?: Corpo2d[];
    gravidade?: IReadOnlyVetor2d;
    gravidadeEscala?: number;
    paredes?: boolean[];
    tamanhoArea?: number;
    friccaoParedes?: number
}

export class Mundo2d {
    private _corpos = new Array<Corpo2d>();
    get corpos(): ReadonlyArray<Corpo2d> { return this._corpos }
    readonly gravidade = new Vetor2d();
    readonly gravidadeEscala: number = 1;
    readonly tamanhoArea: number = 48;
    readonly areas = new Array<Area2d>();
    readonly pares: { [id:string]: Par2d } = {}

    constructor(
        public largura: number,
        public altura: number,
        opcoes: IMundo2dOpcoes
    ) {
        const op = opcoes ?? {};
        this._corpos = op.corpos ?? new Array<Corpo2d>();
        this.gravidade.set(op.gravidade || this.gravidade);
        this.gravidadeEscala = op.gravidadeEscala || this.gravidadeEscala;
        this.tamanhoArea = op.tamanhoArea || this.tamanhoArea;
        if (op.paredes && op.paredes.length == 1) {
            op.paredes =  [op.paredes[0], op.paredes[0], op.paredes[0], op.paredes[0]]; 
            this._adicionarParedes(op.paredes[0], op.paredes[1], op.paredes[2], op.paredes[3], op.friccaoParedes);
        }
        
        this._criarAreas(this.tamanhoArea);
    }

    adicionarCorpo(corpo: Corpo2d) : Corpo2d {
        this._corpos.push(corpo);
        return corpo;
    }

    

    private _adicionarParedes(esquerda: boolean, baixo: boolean, direita: boolean, cima: boolean, friccao?: number) {
        if (esquerda) {
            this.adicionarCorpo(Construtor2d.Retangulo(this.largura, this.altura/2, 50, this.altura, { estatico: true, friccao: friccao }));
        }
        if (baixo) {
            this.adicionarCorpo(Construtor2d.Retangulo(this.largura/2, this.altura, this.largura, 50, { estatico: true, friccao: friccao }));
        }
        if (direita) {
            this.adicionarCorpo(Construtor2d.Retangulo(0, this.altura/2, 50, this.altura, { estatico: true, friccao: friccao }));
        }
        if (cima) {
            this.adicionarCorpo(Construtor2d.Retangulo(this.largura/2, 0, this.largura, 50, { estatico: true, friccao: friccao }));
        }
    }

    private _criarAreas(tamanhoArea: number) {
        if (tamanhoArea == 0) {
            tamanhoArea = Math.floor(this.largura>this.altura?this.largura/20:this.altura/20);
        }
        for(let l=0;l*tamanhoArea<this.altura;l++) {
            for(let c=0;c*tamanhoArea<this.largura;c++) {
                this.areas.push(new Area2d(l, c, tamanhoArea));
            }
        }
    }

    



    private static _ultimoCorpoId = 0;
    static obterProximoCorpoId() {
        this._ultimoCorpoId += 1;
        return this._ultimoCorpoId;
    }

    private static _ultimoFormaId = 0;
    static obterProximoFormaId() {
        this._ultimoFormaId += 1;
        return this._ultimoFormaId;
    }

    private static _ultimoVerticeId = 0;
    static obterProximoVerticeId() {
        this._ultimoVerticeId += 1;
        return this._ultimoVerticeId;
    }
}
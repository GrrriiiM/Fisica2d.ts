import { Corpo2d } from "./Corpo2d";
import { Vetor2d } from "../geometria/Vetor2d";
import { Construtor2d } from "../geometria/Construtor2d";
import { Area2d } from "../colisao/Area2d";
import { Par2d } from "../colisao/Pares2d";

export class Mundo2d {
    readonly corpos: Corpo2d[];
    readonly gravidade: Vetor2d;
    readonly areas = new Array<Area2d>();
    readonly pares: { [id:string]: Par2d } = {}

    constructor(
        public largura: number,
        public altura: number,
        {
            corpos = new Array<Corpo2d>(),
            gravidade = new Vetor2d(),
            paredes = Array<boolean>(),
            tamanhoArea = 0
        }
    ) {
        this.corpos = corpos;
        this.gravidade = gravidade;
        if (paredes.length == 1) {
            paredes =  [paredes[0], paredes[0], paredes[0], paredes[0]]; 
        }
        this._adicionarParedes(paredes[0], paredes[1], paredes[2], paredes[3]);
        this._criarAreas(tamanhoArea);
    }

    adicionarCorpo(corpo: Corpo2d) : Corpo2d {
        this.corpos.push(corpo);
        return corpo;
    }

    

    private _adicionarParedes(esquerda: boolean, baixo: boolean, direita: boolean, cima: boolean) {
        if (esquerda) {
            this.adicionarCorpo(Construtor2d.Retangulo(this.largura, this.altura/2, 50, this.altura, { estatico: true }));
        }
        if (baixo) {
            this.adicionarCorpo(Construtor2d.Retangulo(this.largura/2, this.altura, this.largura, 50, { estatico: true }));
        }
        if (direita) {
            this.adicionarCorpo(Construtor2d.Retangulo(0, this.altura/2, 50, this.altura, { estatico: true }));
        }
        if (cima) {
            this.adicionarCorpo(Construtor2d.Retangulo(this.largura/2, 0, this.largura, 50, { estatico: true }));
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
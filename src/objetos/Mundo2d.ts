import { Corpo2d } from "./Corpo2d";
import { Vetor2d, IReadOnlyVetor2d } from "../geometria/Vetor2d";
import { Construtor2d, IConstrutorCorpo2dOpcoes } from "../geometria/Construtor2d";
import { Area2d } from "../colisao/Area2d";
import { Par2d } from "../colisao/Pares2d";
import { Restricao2d, IRestricao2dOpcoes } from "./Restricao2d";
import { Forma2d } from "../geometria/Forma2d";
import { Mouse2d } from "./Mouse2d";


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
    get corpos(): ReadonlyArray<Corpo2d> { return this._corpos; }
    private _restricoes = new Array<Restricao2d>();
    get restricoes(): ReadonlyArray<Restricao2d> { return this._restricoes; }
    readonly gravidade = new Vetor2d();
    readonly gravidadeEscala: number = 1;
    readonly tamanhoArea: number = 48;
    readonly areas = new Array<Area2d>();
    readonly pares: { [id:string]: Par2d } = {}
    readonly mouse = new Mouse2d();

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

    
    adicionarCorpo(corpo: Corpo2d) : Corpo2d
    adicionarCorpo(x: number, y: number, formas: Forma2d[], opcoes?: IConstrutorCorpo2dOpcoes) : Corpo2d
    adicionarCorpo(arg1: any, arg2?: any, arg3?: any, arg4?: any) : Corpo2d {
        if (arg1 instanceof Corpo2d) return this._adicionarCorpo1(arg1);
        else return this._adicionarCorpo2(arg1, arg2, arg3, arg4);
    }

    private _adicionarCorpo1(corpo: Corpo2d) : Corpo2d {
        this._corpos.push(corpo);
        return corpo;
    }

    private _adicionarCorpo2(x: number, y: number, formas: Forma2d[], opcoes?: IConstrutorCorpo2dOpcoes) : Corpo2d {
        return this._adicionarCorpo1(Construtor2d.Corpo(x, y, formas, opcoes));
    }


    public adicionarRestricao(restricao: Restricao2d) : Restricao2d
    public adicionarRestricao(opcoes: IRestricao2dOpcoes) : Restricao2d
    public adicionarRestricao(arg1: any) : Restricao2d {
        if (arg1 instanceof Restricao2d) return this._adicionarRestricao1(arg1);
        else return this._adicionarRestricao2(arg1);
    }

    private _adicionarRestricao1(restricao: Restricao2d) : Restricao2d {
        this._restricoes.push(restricao);
        return restricao;
    }

    private _adicionarRestricao2(opcoes: IRestricao2dOpcoes) : Restricao2d {
        return this._adicionarRestricao1(new Restricao2d(opcoes));
    }

    

    private _adicionarParedes(esquerda: boolean, baixo: boolean, direita: boolean, cima: boolean, friccao?: number) {
        if (esquerda) {
            this.adicionarCorpo(Construtor2d.Corpo(this.largura, this.altura/2,[Construtor2d.Retangulo(50, this.altura)], { estatico: true, friccao: friccao }));
        }
        if (baixo) {
            this.adicionarCorpo(Construtor2d.Corpo(this.largura/2, this.altura, [Construtor2d.Retangulo(this.largura, 50)], { estatico: true, friccao: friccao }));
        }
        if (direita) {
            this.adicionarCorpo(Construtor2d.Corpo(0, this.altura/2, [Construtor2d.Retangulo(50, this.altura)], { estatico: true, friccao: friccao }));
        }
        if (cima) {
            this.adicionarCorpo(Construtor2d.Corpo(this.largura/2, 0, [Construtor2d.Retangulo(this.largura, 50)], { estatico: true, friccao: friccao }));
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

    atualizarMouse(x: number, y: number, click1: boolean, click2: boolean) {
        this.mouse.set(x, y);
        
        let restricao = this.restricoes.find(_ => _.nome == "___mouse1");
        if (restricao) {
            if (click1 && this.mouse.corpo) {
                this.mouse.corpo.setDormindo(false);
                restricao.pontoB.set(x, y);
                return;
            } else {
                this._restricoes.splice(this._restricoes.indexOf(restricao));
            }
        }
        for(let corpo of this.corpos) {
            if (!corpo.estatico) {
                for(let forma of corpo.formas) {
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
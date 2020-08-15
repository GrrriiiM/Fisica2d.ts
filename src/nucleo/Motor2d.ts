import { Mundo2d } from "../objetos/Mundo2d";
import { Renderizacao2d } from "../renderizacao/Renderizacao2d";
import { Corpo2d } from "../objetos/Corpo2d";
import { Area2d } from "../colisao/Area2d";
import { Par2d } from "../colisao/Pares2d";
import { Colisao2d } from "../colisao/Colisao2d";
import { Eventos2d } from "./Eventos2d";
import { Restricao2d } from "../objetos/Restricao2d";

export class Motor2d {
    private tempoEscala = 1;

    constructor(
        readonly mundo: Mundo2d,
        readonly eventos: Eventos2d = new Eventos2d()
    ) {}

    executar(delta: number, correcao: number, frameId: number) {
        delta = delta || 1000/60;
        correcao = correcao || 1;
        const corpos = this.mundo.corpos;
        const restricoes = this.mundo.restricoes;
        const areas = this.mundo.areas;
        const pares = (<any>Object).values(this.mundo.pares);
        
        //if (delta>33.33) 
        delta = 1;
        this.tempoEscala = 1;

        this._verificarDormindo(corpos);

        this._aplicarGravidade(corpos);

        this._atualizarCorpos(corpos, delta, correcao);

        this._prepararRestricoes(corpos);

        this._resolverRestricoes(this.tempoEscala, restricoes);

        this._atualizarAreas(corpos, areas);

        this._atualizarPares(areas, this.mundo.pares);

        this._detectarColisoes(pares);

        this._dispararEventoColisaoIniciada(pares);

        this._atualizarDormindoColisoes(pares);

        this._resolverPosicao(pares, this.tempoEscala);

        this._resolverImpulso(corpos);

        this._prepararRestricoes(corpos);
        
        this._resolverRestricoes(this.tempoEscala, restricoes);

        this._prepararResolucaoColisao(pares);

        this._resolverColisao(pares, this.tempoEscala);

        this._resetar(corpos);
    }

    private _aplicarGravidade(corpos: ReadonlyArray<Corpo2d>) {
        for(let corpo of corpos) {
            if (!corpo.estatico && !corpo.dormindo) {
                corpo.adicionarForca(this.mundo.gravidade.mult(corpo.massa*this.mundo.gravidadeEscala));
            }
        }
    }

    private _prepararRestricoes(corpos: ReadonlyArray<Corpo2d>) {
        for(let corpo of corpos) {
            corpo.prepararRestricao();
        }
    }

    private _resolverRestricoes(tempoEscala: number, restricoes: ReadonlyArray<Restricao2d>) {
        for(let i=0;i<2;i++) {
            for(let restricao of restricoes) {
                restricao.resolver(tempoEscala);
            }
        }
    }

    private _atualizarCorpos(corpos: ReadonlyArray<Corpo2d>, delta: number, correcao: number) {
        for(let corpo of corpos) {
            if (!corpo.estatico)
                corpo.atualizar(delta, this.tempoEscala, correcao);
        }
    }

    private _verificarDormindo(corpos: ReadonlyArray<Corpo2d>) {
        for(let corpo of corpos) {
            corpo.verificarDormindo(this.tempoEscala)
        }
    }

    private _atualizarAreas(corpos: ReadonlyArray<Corpo2d>, areas: Area2d[]) {
        for(const area of areas) {
            for(const corpo of corpos) {
                for(const forma of corpo.formas) {
                    let formaIndice = area.formas.indexOf(forma);
                    if (forma.bordas.sobrepoem(area.bordas) && formaIndice < 0) {
                        area.formas.push(forma);
                    } else if (!forma.bordas.sobrepoem(area.bordas) && formaIndice >= 0) {
                        area.formas.splice(formaIndice);
                    }
                }
            }
        }
    }

    private _atualizarPares(areas: Area2d[], pares: { [id:string]: Par2d }) {
        areas.forEach(_ => _.par = false);
        for(const area of areas.filter(_ => _.formas.length>1)) {
            for(let i=0;i<area.formas.length;i++) {
                for(let j=i+1;j<area.formas.length;j++) {
                    const formaA = area.formas[i];
                    const formaB = area.formas[j];
                    if (formaA.corpo == formaB.corpo) continue;
                    if (formaA.corpo.estatico && formaB.corpo.estatico) continue;
                    area.par = true;
                    const id = Par2d.CriarId(formaA, formaB);
                    if (!pares[id]) {
                        pares[id] = new Par2d(formaA, formaB);
                    }
                }
            }
        }
    }

    private _detectarColisoes(pares: Par2d[]) {
        for(const par of pares) {
            par.detectarColisao();
        }
    }

    private _dispararEventoColisaoIniciada(pares: Par2d[]) {
        if (this.eventos.onColisaoIniciada) {
            const colisoes = pares.filter(_ => _.colisaoIniciada).map(_ => _.colisao);
            this.eventos.onColisaoIniciada(this.mundo, colisoes);
        }
    }

    private _atualizarDormindoColisoes(pares: Par2d[]) {
        for(const par of pares) {
            par.atualizarDormindo(this.tempoEscala);
        }
    }

    private _resolverPosicao(pares: Par2d[], tempoEscala: number) {
        for(let i=0;i<6;i++) {
            for(const par of pares) {
                par.resolverSeparacao();
            }
            for(const par of pares) {
                par.resolverPosicao(tempoEscala);
            }
        }
    }

    private _resolverImpulso(corpos: ReadonlyArray<Corpo2d>) {
        for(const corpo of corpos) {
            corpo.ajustarColisao();
        }
    }

    private _prepararResolucaoColisao(pares: Par2d[]) {
        for(const par of pares) {
            par.prepararResolucaoColisao();
        }
    }

    private _resolverColisao(pares: Par2d[], tempoEscala: number) {
        for(let i=0;i<4;i++) {
            for(const par of pares) {
                par.resolverColisao(tempoEscala);
            }
        }
    }

    private _dispararEventoColisaoEncerrada(pares: Par2d[]) {
        if (this.eventos.onColisaoEncerrada) {
            const colisoes = pares.filter(_ => _.colisaoEncerrada).map(_ => _.colisaoAnterior);
            this.eventos.onColisaoEncerrada(this.mundo, colisoes);
        }
    }

    private _resetar(corpos: ReadonlyArray<Corpo2d>) {
        corpos.forEach(_ => _.resetar());
    }
    
}
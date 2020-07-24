import { Mundo2d } from "../objetos/Mundo2d";
import { Renderizacao2d } from "../renderizacao/Renderizacao2d";
import { Corpo2d } from "../objetos/Corpo2d";
import { Area2d } from "../colisao/Area2d";
import { Par2d } from "../colisao/Pares2d";

export class Motor2d {
    private tempoEscala = 1;

    constructor(
        readonly mundo: Mundo2d
    ) {}

    executar(delta: number, correcao: number, frameId: number) {
        delta = delta || 1000/60;
        correcao = correcao || 1;
        const corpos = this.mundo.corpos;
        const areas = this.mundo.areas;
        const pares = (<any>Object).values(this.mundo.pares);
        
        if (delta>33.33) delta = 33.33;

        this._aplicarGravidade(corpos);

        this._atualizarCorpos(corpos, delta, correcao);

        this._atualizarAreas(corpos, areas);

        this._atualizarPares(areas, this.mundo.pares);

        this._detectarColisoes(pares);

        this._resolverPosicao(pares, this.tempoEscala);

        this._resolverImpulso(corpos);

        this._prepararResolucaoColisao(pares);

        this._resolverColisao(pares, this.tempoEscala);

        this._resetar(corpos);
    }

    private _aplicarGravidade(corpos: Array<Corpo2d>) {
        for(let corpo of corpos) {
            if (!corpo.estatico) {
                corpo.adicionarForca(this.mundo.gravidade.mult(corpo.massa*this.mundo.gravidadeEscala));
            }
        }
    }

    private _atualizarCorpos(corpos: Array<Corpo2d>, delta: number, correcao: number) {
        for(let corpo of corpos) {
            if (!corpo.estatico)
                corpo.atualizar(delta, this.tempoEscala, correcao);
        }
    }

    private _atualizarAreas(corpos: Corpo2d[], areas: Area2d[]) {
        for(const area of areas) {
            for(const corpo of corpos) {
                for(const parte of corpo.partes) {
                    let formaIndice = area.formas.indexOf(parte);
                    if (parte.bordas.sobrepoem(area.bordas) && formaIndice < 0) {
                        area.formas.push(parte);
                    } else if (!parte.bordas.sobrepoem(area.bordas) && formaIndice >= 0) {
                        area.formas.splice(formaIndice);
                    }
                }
            }
        }
    }

    private _atualizarPares(areas: Area2d[], pares: { [id:string]: Par2d }) {
        for(const area of areas.filter(_ => _.formas.length>1)) {
            for(let i=0;i<area.formas.length;i++) {
                for(let j=i+1;j<area.formas.length;j++) {
                    const formaA = area.formas[i];
                    const formaB = area.formas[j];
                    if (!formaA.corpo.estatico || !formaB.corpo.estatico) {
                        const id = Par2d.CriarId(formaA, formaB);
                        if (!pares[id]) {
                            pares[id] = new Par2d(formaA, formaB);
                        }
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

    private _resolverImpulso(corpos: Corpo2d[]) {
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

    private _resetar(corpos: Corpo2d[]) {
        corpos.forEach(_ => _.resetar());
    }
    
}
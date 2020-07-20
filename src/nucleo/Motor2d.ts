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

    executar(delta: number, correcao: number) {
        delta = delta || 1000/60;
        correcao = correcao || 1;
        const corpos = this.mundo.corpos;
        const areas = this.mundo.areas;
        const pares = this.mundo.pares;


        this._aplicarGravidade(corpos);

        this._atualizarCorpos(corpos, delta, correcao);

        this._atualizarAreas(corpos, areas);

        this._atualizarPares(areas, pares);

        this._detectarColisoes((<any>Object).values(pares));
    }

    private _aplicarGravidade(corpos: Array<Corpo2d>) {
        for(let corpo of corpos) {
            if (!corpo.estatico) {
                corpo.adicionarForca(this.mundo.gravidade.mult(corpo.massa));
            }
        }
    }

    private _atualizarCorpos(corpos: Array<Corpo2d>, delta: number, correcao: number) {
        for(let corpo of corpos) {
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

    
}
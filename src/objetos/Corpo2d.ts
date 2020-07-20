
import { Vetor2d } from "../geometria/Vetor2d";
import { Mundo2d } from "./Mundo2d";
import { Forma2d } from "../geometria/Forma2d";

export interface ICorpo2dOpcoes{
    estatico: boolean
}

export class Corpo2d {
    readonly id: number;
    readonly nome: string;
    private angulo = 0;
    readonly torque = 0;
    private velocidadeAngular = 0;
    readonly sensor = false;
    readonly estatico = false;
    readonly dormindo = false;
    readonly movimento = 0;
    readonly dormindoLimite = 60;
    readonly densidade = 0.01;
    readonly restituicao = 0;
    readonly friccao = 0.1;
    readonly friccaoEstatica = 0.5;
    readonly friccaoAr = 0.01;
    readonly despejo = 0.05;
    readonly tempoEscala = 1;
    readonly prePosition: Vetor2d;
    preAngulo: number;
    readonly area: number;
    readonly massa: number;
    readonly massaInvertida: number;
    readonly inercia: number;
    rapidez = 0;
    private contatosQuantidade = 0;
    rapidezAngular = 0;
    readonly forca = new Vetor2d();
    readonly impulsoPosicao = new Vetor2d();
    readonly impulsoRestricao = new Vetor2d();
    readonly velocidade = new Vetor2d();

    constructor(
        readonly posicao: Vetor2d,
        readonly partes: Forma2d[],
        opcoes?: ICorpo2dOpcoes
    ) {
        (<any>Object).assign(this, opcoes);
        this.id = Mundo2d.obterProximoCorpoId();
        this.nome = this.nome || `corpo${this.id}`;
        for(const parte of this.partes) {
            parte.definir(this);
        }
        this.area = this.partes.reduce((a,c) => a+=c.area, 0);
        if (!this.estatico) {
            this.massa = this.area * this.densidade;
            this.massaInvertida = 1/this.massa;
            this.inercia = (this.massa / 6) * this.partes.reduce((a,c) => a+=c.inercia, 0);
        } else {
            this.massa = Number.POSITIVE_INFINITY;
            this.massaInvertida = 0;
            this.inercia = Number.POSITIVE_INFINITY;
        }
        this.prePosition = this.posicao;
        this.preAngulo = this.angulo;
    }

    atualizar(delta: number, tempoEscala: number, correcao: number) {
        const deltaQuadrado = Math.pow(delta * tempoEscala * this.tempoEscala, 2);

        const friccaoAr = 1 - this.friccaoAr * tempoEscala * this.tempoEscala;
        const preVelocidade = this.posicao.sub(this.prePosition);

        this.velocidade.set(preVelocidade.mult(friccaoAr*correcao).adic(this.forca.div(this.massa*deltaQuadrado)));
        this.prePosition.set(this.posicao);
        this.posicao.adicV(this.velocidade);

        this.velocidadeAngular = ((this.angulo - this.preAngulo) * friccaoAr * correcao) + (this.torque/this.inercia) * deltaQuadrado
        this.preAngulo = this.angulo;
        this.angulo += this.velocidadeAngular;
    
        this.rapidez = this.velocidade.mag;
        this.rapidezAngular = Math.abs(this.velocidadeAngular);

        for (const parte of this.partes) {
            parte.vertices.adicV(this.velocidade); 
            parte.posicao.adic(this.velocidade);

            if (this.velocidadeAngular !== 0) {
                parte.vertices.subV(this.posicao).rotV(this.velocidadeAngular).adicV(this.posicao);
                parte.eixos.rot(this.velocidadeAngular);
                parte.posicao.sub(this.posicao).rot(this.velocidadeAngular).adic(this.posicao);
            }
            parte.bordas.set(parte.vertices);
        }
    }

    adicionarForca(forca: Vetor2d) {
        this.forca.adicV(forca);
    }
}


import { Forma2d } from "../geometria/Forma2d";
import { Corpo2d } from "../objetos/Corpo2d";
import { Contato2d } from "./Contato2d";
import { Sat2d } from "./Sat2d";
import { Colisao2d } from "./Colisao2d";

export class Par2d {
    readonly id: string;
    readonly corpoA: Corpo2d;
    readonly corpoB: Corpo2d;
    readonly massaInvertida: number;
    readonly friccao: number;
    readonly friccaoEstatica: number;
    readonly restituicao: number;
    readonly despejo: number;
    private separacao = 0;
    colisao: Colisao2d;
    colidiu: boolean = false;

    constructor(
        readonly formaA: Forma2d,
        readonly formaB: Forma2d
    ) {
        this.id = Par2d.CriarId(formaA, formaB);
        this.corpoA = this.formaA.corpo;
        this.corpoB = this.formaB.corpo;
        this.massaInvertida = this.corpoA.massaInvertida + this.corpoB.massaInvertida;
        this.friccao = Math.min(this.corpoA.friccao, this.corpoB.friccao);
        this.friccaoEstatica = Math.max(this.corpoA.friccaoEstatica, this.corpoB.friccaoEstatica);
        this.restituicao = Math.max(this.corpoA.restituicao, this.corpoB.restituicao);
        this.despejo = Math.max(this.corpoA.despejo, this.corpoB.despejo);
    }

    static CriarId(formaA: Forma2d, formaB: Forma2d) {
        return `${formaA.id}_${formaB.id}`;
    }

    detectarColisao() {
        this.colidiu = false;
        this.colisao = Sat2d.detectar(this.formaA, this.formaB, this.colisao);
        if (this.colisao && this.colisao.contatos.length) {
            this.colidiu = true;
            this.formaA.corpo.contatosQuantidade+=this.colisao.contatos.length;
            this.formaB.corpo.contatosQuantidade+=this.colisao.contatos.length;
        }
    }

    resolverPosicao(tempoEscala: number) {   
        if (this.colisao) {
            const colisao = this.colisao;
            const corpoA = this.colisao.corpoA;
            const corpoB = this.colisao.corpoB;
            const norma = this.colisao.norma;
            
            this.separacao = norma.dot(corpoB.impulsoPosicao.adic(corpoB.posicao).sub(corpoA.impulsoPosicao.adic(corpoB.posicao.sub(colisao.penetracao))));
        
            let impulso = (this.separacao - this.despejo) * tempoEscala;
            
            
            if (corpoA.estatico || corpoB.estatico)
                impulso *= 2;
            
            if (!corpoA.estatico) {
                corpoA.impulsoPosicao.adicV(norma.mult(impulso * (0.9 / corpoA.contatosQuantidade)));
            }

            if (!corpoB.estatico) {
                corpoB.impulsoPosicao.subV(norma.mult(impulso * (0.9 / corpoB.contatosQuantidade)));
            }
        }
    }

    prepararResolucaoColisao() {
        if (!this.colisao) return;
        const colisao = this.colisao;
        const contatos = colisao.contatos;
        const corpoA = colisao.corpoA;
        const corpoB = colisao.corpoB;
        const norma = colisao.norma;
        const tangente = colisao.tangente;    
        for(const contato of contatos) {
            const vetor = contato.vetor;
            const impulsoNorma = contato.impulsoNorma;
            const impulsoTangente = contato.impulsoTangente;
            if (impulsoNorma != 0 || impulsoTangente != 0) {
                const impulso = norma.mult(impulsoNorma).adic(tangente.mult(impulsoTangente));
                if (!corpoA.estatico) {
                    vetor.sub(corpoA.posicao);
                    corpoA.prePosicao.adicV(impulso.mult(corpoA.massaInvertida));
                    corpoA.preAngulo += vetor.sub(corpoA.posicao).cross(impulso) * corpoA.inerciaInvertida;
                }
                if (!corpoB.estatico) {
                    vetor.sub(corpoB.posicao);
                    corpoB.prePosicao.adicV(impulso.mult(corpoB.massaInvertida));
                    corpoB.preAngulo += vetor.sub(corpoB.posicao).cross(impulso) * corpoB.inerciaInvertida;
                }
            }
        }

    }

    resolverColisao(tempoEscala) {
        if (!this.colisao) return;

        const tempoEscalaQuadrado = tempoEscala * tempoEscala
        const colisao = this.colisao;
        const contatos = colisao.contatos;
        const corpoA = colisao.corpoA;
        const corpoB = colisao.corpoB;
        const norma = colisao.norma;
        const tangente = colisao.tangente;
        const contatoCompartilhado = 1/contatos.length;

        corpoA.velocidade.set(corpoA.posicao.sub(corpoA.prePosicao));
        corpoB.velocidade.set(corpoB.posicao.sub(corpoB.prePosicao));
        corpoA.velocidadeAngular = corpoA.angulo - corpoA.preAngulo;
        corpoB.velocidadeAngular = corpoB.angulo - corpoB.preAngulo;

        for(const contato of contatos) {
            const vetor = contato.vetor;
            const offsetA = vetor.sub(corpoA.posicao);
            const offsetB = vetor.sub(corpoB.posicao);
            const velocidadePontoA = corpoA.velocidade.adic(offsetA.perp().mult(corpoA.velocidadeAngular));
            const velocidadePontoB = corpoB.velocidade.adic(offsetA.perp().mult(corpoB.velocidadeAngular));
            const velocidadeRelativa = velocidadePontoA.sub(velocidadePontoB);
            const velocidadeNorma = norma.dot(velocidadeRelativa);
            const velocidadeTangente = tangente.dot(velocidadeRelativa);
            const rapidezTangente = Math.abs(velocidadeTangente);
            const velocidadeTangenteDirecao = velocidadeTangente < 0 ? -1 : 1;

            let impulsoNorma = (1 + this.restituicao) * velocidadeNorma;
            const forcaNorma = this._limitar(this.separacao + velocidadeNorma, 0, 1) * 5;

            let impulsoTangente = velocidadeTangente;
            let friccaoMaxima = Number.POSITIVE_INFINITY;

            if (rapidezTangente > this.friccao*this.friccaoEstatica*forcaNorma*tempoEscalaQuadrado) {
                friccaoMaxima = rapidezTangente;
                impulsoTangente = this._limitar(this.friccaoEstatica * velocidadeTangenteDirecao * tempoEscalaQuadrado, -friccaoMaxima, friccaoMaxima);
            }
            
            let oAcN = offsetA.cross(norma);
            let oBcN = offsetB.cross(norma);
            let compartilhado = contatoCompartilhado / (corpoA.massaInvertida + corpoB.massaInvertida + corpoA.inerciaInvertida*oAcN*oAcN + corpoB.inerciaInvertida*oBcN*oBcN);

            impulsoNorma *= compartilhado;
            impulsoTangente *= compartilhado;

            if (velocidadeNorma < 0 && velocidadeNorma*velocidadeNorma > 4 * tempoEscalaQuadrado) {
                contato.impulsoNorma = 0;
            } else {
                let contatoImpulsoNorma = contato.impulsoNorma;
                contato.impulsoNorma = Math.min(contato.impulsoNorma + impulsoNorma, 0);
                impulsoNorma = contato.impulsoNorma - contatoImpulsoNorma;
            }

            if (velocidadeTangente*velocidadeTangente > 6 * tempoEscalaQuadrado) {
                contato.impulsoTangente = 0
            } else {
                let contatoImpulsoTangente = contato.impulsoTangente;
                contato.impulsoTangente = this._limitar(contato.impulsoTangente + impulsoTangente, -friccaoMaxima, friccaoMaxima);
                impulsoTangente = contato.impulsoTangente - contatoImpulsoTangente;
            }
            
            const impulso = norma.mult(impulsoNorma).adic(tangente.mult(impulsoTangente));

            if (!corpoA.estatico) {
                corpoA.prePosicao.adicV(impulso.mult(corpoA.massaInvertida))
                //corpoA.preAngulo += offsetA.cross(impulso) * corpoA.inerciaInvertida;
            }

            if (!corpoB.estatico) {
                corpoB.prePosicao.subV(impulso.mult(corpoB.massaInvertida))
                corpoB.preAngulo -= offsetB.cross(impulso) * corpoB.inerciaInvertida;
            }
        }
    }

    private _limitar(valor: number, minimo: number, maximo: number) {
        if (valor<minimo) return minimo;
        if (valor>maximo) return maximo;
        return valor;
    }
}
import { Forma2d } from "../geometria/Forma2d";
import { Colisao2d } from "./Colisao2d";
import { Eixo2d } from "../geometria/Eixos2d";
import { Vertices2d, Vertice2d } from "../geometria/Vertices2d";
import { Vetor2d } from "../geometria/Vetor2d";
import { Contato2d } from "./Contato2d";

export class Sat2d {
    static detectar(formaA: Forma2d, formaB: Forma2d, colisaoAnterior: Colisao2d): Colisao2d {
        
        if (!formaA.bordas.sobrepoem(formaB.bordas)) return null;

        let colisao: Colisao2d;
        let reaproveitarColisao: boolean;
        const corpoA = formaA.corpo;
        const corpoB = formaB.corpo;

        if (colisaoAnterior) {
            
            const movimento = corpoA.rapidez * corpoA.rapidez + corpoA.rapidezAngular * corpoA.rapidezAngular
                + corpoB.rapidez * corpoB.rapidez + corpoB.rapidezAngular * corpoB.rapidezAngular;
            reaproveitarColisao = movimento < 0.2;
            colisao = colisaoAnterior;
        } else {
            colisao = new Colisao2d(formaA, formaB);
        }

        if (reaproveitarColisao) {
            const formaEixoA = colisao.eixoForma;
            const formaEixoB = formaEixoA == formaA ? formaB : formaA;
            const eixo = formaEixoA.eixos[colisao.eixoIndice];

            const eixoSobreposicao = this._eixoSobrepoem(formaEixoA.vertices, formaEixoB.vertices, [eixo]);

            if (eixoSobreposicao.sobreposicao <= 0) {
                return null;
            }
            
            colisao.sobreposicao = eixoSobreposicao.sobreposicao;

        } else {
            const eixoSobreposicaoAB = this._eixoSobrepoem(formaA.vertices, formaB.vertices, formaA.eixos);

            if (eixoSobreposicaoAB.sobreposicao <= 0) {
                return null;
            }

            const eixoSobreposicaoBA = this._eixoSobrepoem(formaB.vertices, formaA.vertices, formaB.eixos);

            if (eixoSobreposicaoBA.sobreposicao <= 0) {
                return null;
            }

            if (eixoSobreposicaoAB.sobreposicao < eixoSobreposicaoBA.sobreposicao) {
                colisao.sobreposicao = eixoSobreposicaoAB.sobreposicao;
                colisao.eixoForma = formaA;
                colisao.eixoIndice = eixoSobreposicaoAB.eixoIndice;
            } else {
                colisao.sobreposicao = eixoSobreposicaoBA.sobreposicao;
                colisao.eixoForma = formaB;
                colisao.eixoIndice = eixoSobreposicaoBA.eixoIndice;

            }
        }


        let eixo = colisao.eixoForma.eixos[colisao.eixoIndice];
        
        if (eixo.dot(corpoB.posicao.sub(corpoA.posicao)) < 0) {
            colisao.norma = eixo.copia;
        } else {
            colisao.norma = eixo.copia.inv();
        }

        colisao.tangente = colisao.norma.perp();

        colisao.penetracao = colisao.norma.mult(colisao.sobreposicao);; 

        const contatos = new Array<Vertice2d>();

        var contatoB = this._encontrarContatos(formaA, formaB, colisao.norma);

        if (formaA.vertices.contem(contatoB[0]))
            contatos.push(contatoB[0]);

        if (formaA.vertices.contem(contatoB[1]))
            contatos.push(contatoB[1]);

        if (contatos.length < 2) {
            var contatosA = this._encontrarContatos(formaB, formaA, colisao.norma.inv());
                
            if (formaB.vertices.contem(contatosA[0]))
                contatos.push(contatosA[0]);

            if (contatos.length < 2 && formaB.vertices.contem(contatosA[1]))
                contatos.push(contatosA[1]);
        }

        if (contatos.length < 1)
            contatos.push(contatoB[0]);
        
        const contatosAnteriores = colisao.contatos.splice(0);
        for(const contato of contatos) {
            let contatoAnterior = contatosAnteriores.find(_ => _.id == contato.id)
            let novoContato = new Contato2d(contato);
            if (contatoAnterior) {
                novoContato.impulsoNorma = contatoAnterior.impulsoNorma;
                novoContato.impulsoTangente = contatoAnterior.impulsoTangente;
            }

            colisao.contatos.push(novoContato);
        }

        

        return colisao;
    }

    static _eixoSobrepoem(verticesA: Vertices2d, verticesB: Vertices2d, eixos: Eixo2d[]): { sobreposicao: number, eixoIndice: number } {
        let resultado: { sobreposicao: number, eixoIndice: number } = { sobreposicao: Number.MAX_VALUE, eixoIndice: -1 };

        for(const eixo of eixos) {
            const projecaoA = this._projetarEixo(verticesA, eixo);
            const projecaoB = this._projetarEixo(verticesB, eixo);
            const sobreposicao = Math.min(projecaoA.max - projecaoB.min, projecaoB.max - projecaoA.min);

            if (sobreposicao<=0) {
                resultado.sobreposicao = sobreposicao;
                return resultado;
            }

            if (sobreposicao < resultado.sobreposicao) {
                resultado.sobreposicao = sobreposicao;
                resultado.eixoIndice = eixos.indexOf(eixo);
            }
        }

        return resultado;
    }

    static _encontrarContatos(formaA: Forma2d, formaB: Forma2d, norma: Vetor2d): Vertice2d[] {
        let menorDistancia = Number.MAX_VALUE;
        let vertices = formaB.vertices;
        let posicao = formaA.posicao;
        let verticeA: Vertice2d;
        let verticeB: Vertice2d;

        for(const vertice of vertices) {
            const distancia = -norma.dot(vertice.sub(posicao));
            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                verticeA = vertice;
            }
        }

        const verticeAnterior = vertices.anterior(verticeA);
        menorDistancia = -norma.dot(verticeAnterior.sub(posicao));
        verticeB = verticeAnterior;

        const verticeProximo = vertices.proximo(verticeA);
        if (-norma.dot(verticeProximo.sub(posicao)) < menorDistancia) {
            verticeB = verticeProximo;
        }

        return [verticeA, verticeB];
    }

    static _projetarEixo(vertices: Vetor2d[], eixo: Eixo2d): { min: number, max: number } {
        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;

        for(const vertice of vertices) {
            const dot = vertice.dot(eixo);
            if (dot > max) { 
                max = dot; 
            }
            if (dot < min) { 
                min = dot; 
            }
        }

        return { min, max };
    };
}
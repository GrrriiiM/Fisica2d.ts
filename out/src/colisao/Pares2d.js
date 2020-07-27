import { Sat2d } from "./Sat2d.js";
export class Par2d {
    constructor(formaA, formaB) {
        this.formaA = formaA;
        this.formaB = formaB;
        this.separacao = 0;
        this._colisaoIniciada = false;
        this._colisaoEncerrada = false;
        this.id = Par2d.CriarId(formaA, formaB);
        this.corpoA = this.formaA.corpo;
        this.corpoB = this.formaB.corpo;
        this.massaInvertida = this.corpoA.massaInvertida + this.corpoB.massaInvertida;
        this.friccao = Math.min(this.corpoA.friccao, this.corpoB.friccao);
        this.friccaoEstatica = Math.max(this.corpoA.friccaoEstatica, this.corpoB.friccaoEstatica);
        this.restituicao = Math.max(this.corpoA.restituicao, this.corpoB.restituicao);
        this.despejo = Math.max(this.corpoA.despejo, this.corpoB.despejo);
    }
    get colisaoIniciada() { return this._colisaoIniciada; }
    get colisaoEncerrada() { return this._colisaoEncerrada; }
    get colisao() { return this._colisao; }
    get colisaoAnterior() { return this._colisaoAnterior; }
    static CriarId(formaA, formaB) {
        return `${formaA.id}_${formaB.id}`;
    }
    detectarColisao() {
        this._colisaoIniciada = false;
        this._colisaoAnterior = this.colisao;
        this._colisao = Sat2d.detectar(this.formaA, this.formaB, this._colisaoAnterior);
        if (this.colisao && this.colisao.contatos.length) {
            if (!this._colisaoAnterior && this.colisao) {
                this._colisaoIniciada = true;
            }
            this.formaA.corpo.contatosQuantidade += this.colisao.contatos.length;
            this.formaB.corpo.contatosQuantidade += this.colisao.contatos.length;
        }
        if (this._colisaoAnterior && !this.colisao) {
            this._colisaoEncerrada = true;
        }
    }
    atualizarDormindo(tempoEscala) {
        if (this.colisao == null)
            return;
        const tempoFator = tempoEscala * tempoEscala * tempoEscala;
        const colisao = this.colisao;
        const corpoA = colisao.corpoA;
        const corpoB = colisao.corpoB;
        if ((corpoA.dormindo && corpoB.dormindo) || corpoA.estatico || corpoB.estatico)
            return;
        if (corpoA.dormindo || corpoB.dormindo) {
            const corpoDomindo = (corpoA.dormindo && !corpoA.estatico) ? corpoA : corpoB;
            const corpoMovimento = corpoDomindo == corpoA ? corpoB : corpoA;
            if (!corpoDomindo.estatico && corpoMovimento.movimento > 0.18 * tempoFator)
                corpoDomindo.setDormindo(false);
        }
    }
    resolverSeparacao() {
        if (!this.colisao)
            return;
        const colisao = this.colisao;
        const corpoA = this.colisao.corpoA;
        const corpoB = this.colisao.corpoB;
        const norma = this.colisao.norma;
        this.separacao = norma.dot(corpoB.correcaoPosicao.adic(corpoB.posicao).sub(corpoA.correcaoPosicao.adic(corpoB.posicao.sub(colisao.penetracao))));
    }
    resolverPosicao(tempoEscala) {
        if (!this.colisao)
            return;
        const corpoA = this.colisao.corpoA;
        const corpoB = this.colisao.corpoB;
        const norma = this.colisao.norma;
        let impulso = (this.separacao - this.despejo) * tempoEscala;
        if (corpoA.estatico || corpoB.estatico)
            impulso *= 2;
        corpoA.adicionarCorrecaoPosicao(norma, impulso);
        corpoB.adicionarCorrecaoPosicao(norma.inv(), impulso);
    }
    prepararResolucaoColisao() {
        if (!this.colisao)
            return;
        const colisao = this.colisao;
        const contatos = colisao.contatos;
        const corpoA = colisao.corpoA;
        const corpoB = colisao.corpoB;
        const norma = colisao.norma;
        const tangente = colisao.tangente;
        for (const contato of contatos) {
            const vetor = contato;
            const impulsoNorma = contato.impulsoNorma;
            const impulsoTangente = contato.impulsoTangente;
            if (impulsoNorma != 0 || impulsoTangente != 0) {
                const impulso = norma.mult(impulsoNorma).adic(tangente.mult(impulsoTangente));
                if (!corpoA.estatico && !corpoA.dormindo) {
                    corpoA.prePosicao.adicV(impulso.mult(corpoA.massaInvertida));
                    corpoA.preAngulo += vetor.sub(corpoA.posicao).cross(impulso) * corpoA.inerciaInvertida;
                }
                if (!corpoB.estatico && !corpoB.dormindo) {
                    vetor.sub(corpoB.posicao);
                    corpoB.prePosicao.subV(impulso.mult(corpoB.massaInvertida));
                    corpoB.preAngulo -= vetor.sub(corpoB.posicao).cross(impulso) * corpoB.inerciaInvertida;
                }
            }
        }
    }
    resolverColisao(tempoEscala) {
        if (!this.colisao)
            return;
        const tempoEscalaQuadrado = tempoEscala * tempoEscala;
        const colisao = this.colisao;
        const contatos = colisao.contatos;
        const corpoA = colisao.corpoA;
        const corpoB = colisao.corpoB;
        const norma = colisao.norma;
        const tangente = colisao.tangente;
        const contatoCompartilhado = 1 / contatos.length;
        const velocidadeA = corpoA.posicao.sub(corpoA.prePosicao);
        const velocidadeB = corpoB.posicao.sub(corpoB.prePosicao);
        const velocidadeAngularA = corpoA.angulo - corpoA.preAngulo;
        const velocidadeAngularB = corpoB.angulo - corpoB.preAngulo;
        for (const contato of contatos) {
            const vetor = contato;
            const offsetA = vetor.sub(corpoA.posicao);
            const offsetB = vetor.sub(corpoB.posicao);
            const velocidadePontoA = velocidadeA.adic(offsetA.perp().mult(velocidadeAngularA));
            const velocidadePontoB = velocidadeB.adic(offsetB.perp().mult(velocidadeAngularB));
            const velocidadeRelativa = velocidadePontoA.sub(velocidadePontoB);
            const velocidadeNorma = norma.dot(velocidadeRelativa);
            const velocidadeTangente = tangente.dot(velocidadeRelativa);
            const rapidezTangente = Math.abs(velocidadeTangente);
            const velocidadeTangenteDirecao = velocidadeTangente < 0 ? -1 : 1;
            let impulsoNorma = (1 + this.restituicao) * velocidadeNorma;
            const forcaNorma = this._limitar(this.separacao + velocidadeNorma, 0, 1) * 5;
            let impulsoTangente = velocidadeTangente;
            let friccaoMaxima = Number.POSITIVE_INFINITY;
            if (rapidezTangente > this.friccao * this.friccaoEstatica * forcaNorma * tempoEscalaQuadrado) {
                friccaoMaxima = rapidezTangente;
                impulsoTangente = this._limitar(this.friccaoEstatica * velocidadeTangenteDirecao * tempoEscalaQuadrado, -friccaoMaxima, friccaoMaxima);
            }
            let oAcN = offsetA.cross(norma);
            let oBcN = offsetB.cross(norma);
            let compartilhado = contatoCompartilhado / (corpoA.massaInvertida + corpoB.massaInvertida + corpoA.inerciaInvertida * oAcN * oAcN + corpoB.inerciaInvertida * oBcN * oBcN);
            impulsoNorma *= compartilhado;
            impulsoTangente *= compartilhado;
            if (velocidadeNorma < 0 && velocidadeNorma * velocidadeNorma > 4 * tempoEscalaQuadrado) {
                contato.impulsoNorma = 0;
            }
            else {
                let contatoImpulsoNorma = contato.impulsoNorma;
                contato.impulsoNorma = Math.min(contato.impulsoNorma + impulsoNorma, 0);
                impulsoNorma = contato.impulsoNorma - contatoImpulsoNorma;
            }
            if (velocidadeTangente * velocidadeTangente > 6 * tempoEscalaQuadrado) {
                contato.impulsoTangente = 0;
            }
            else {
                let contatoImpulsoTangente = contato.impulsoTangente;
                contato.impulsoTangente = this._limitar(contato.impulsoTangente + impulsoTangente, -friccaoMaxima, friccaoMaxima);
                impulsoTangente = contato.impulsoTangente - contatoImpulsoTangente;
            }
            const impulso = norma.mult(impulsoNorma).adic(tangente.mult(impulsoTangente));
            if (!corpoA.estatico && !corpoA.dormindo) {
                corpoA.prePosicao.adicV(impulso.mult(corpoA.massaInvertida));
                corpoA.preAngulo += offsetA.cross(impulso) * corpoA.inerciaInvertida;
            }
            if (!corpoB.estatico && !corpoB.dormindo) {
                corpoB.prePosicao.subV(impulso.mult(corpoB.massaInvertida));
                corpoB.preAngulo -= offsetB.cross(impulso) * corpoB.inerciaInvertida;
            }
        }
    }
    _limitar(valor, minimo, maximo) {
        if (valor < minimo)
            return minimo;
        if (valor > maximo)
            return maximo;
        return valor;
    }
}
//# sourceMappingURL=Pares2d.js.map
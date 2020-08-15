import { Par2d } from "../colisao/Pares2d.js";
import { Eventos2d } from "./Eventos2d.js";
export class Motor2d {
    constructor(mundo, eventos = new Eventos2d()) {
        this.mundo = mundo;
        this.eventos = eventos;
        this.tempoEscala = 1;
    }
    executar(delta, correcao, frameId) {
        delta = delta || 1000 / 60;
        correcao = correcao || 1;
        const corpos = this.mundo.corpos;
        const restricoes = this.mundo.restricoes;
        const areas = this.mundo.areas;
        const pares = Object.values(this.mundo.pares);
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
    _aplicarGravidade(corpos) {
        for (let corpo of corpos) {
            if (!corpo.estatico && !corpo.dormindo) {
                corpo.adicionarForca(this.mundo.gravidade.mult(corpo.massa * this.mundo.gravidadeEscala));
            }
        }
    }
    _prepararRestricoes(corpos) {
        for (let corpo of corpos) {
            corpo.prepararRestricao();
        }
    }
    _resolverRestricoes(tempoEscala, restricoes) {
        for (let i = 0; i < 2; i++) {
            for (let restricao of restricoes) {
                restricao.resolver(tempoEscala);
            }
        }
    }
    _atualizarCorpos(corpos, delta, correcao) {
        for (let corpo of corpos) {
            if (!corpo.estatico)
                corpo.atualizar(delta, this.tempoEscala, correcao);
        }
    }
    _verificarDormindo(corpos) {
        for (let corpo of corpos) {
            corpo.verificarDormindo(this.tempoEscala);
        }
    }
    _atualizarAreas(corpos, areas) {
        for (const area of areas) {
            for (const corpo of corpos) {
                for (const forma of corpo.formas) {
                    let formaIndice = area.formas.indexOf(forma);
                    if (forma.bordas.sobrepoem(area.bordas) && formaIndice < 0) {
                        area.formas.push(forma);
                    }
                    else if (!forma.bordas.sobrepoem(area.bordas) && formaIndice >= 0) {
                        area.formas.splice(formaIndice);
                    }
                }
            }
        }
    }
    _atualizarPares(areas, pares) {
        areas.forEach(_ => _.par = false);
        for (const area of areas.filter(_ => _.formas.length > 1)) {
            for (let i = 0; i < area.formas.length; i++) {
                for (let j = i + 1; j < area.formas.length; j++) {
                    const formaA = area.formas[i];
                    const formaB = area.formas[j];
                    if (formaA.corpo == formaB.corpo)
                        continue;
                    if (formaA.corpo.estatico && formaB.corpo.estatico)
                        continue;
                    area.par = true;
                    const id = Par2d.CriarId(formaA, formaB);
                    if (!pares[id]) {
                        pares[id] = new Par2d(formaA, formaB);
                    }
                }
            }
        }
    }
    _detectarColisoes(pares) {
        for (const par of pares) {
            par.detectarColisao();
        }
    }
    _dispararEventoColisaoIniciada(pares) {
        if (this.eventos.onColisaoIniciada) {
            const colisoes = pares.filter(_ => _.colisaoIniciada).map(_ => _.colisao);
            this.eventos.onColisaoIniciada(this.mundo, colisoes);
        }
    }
    _atualizarDormindoColisoes(pares) {
        for (const par of pares) {
            par.atualizarDormindo(this.tempoEscala);
        }
    }
    _resolverPosicao(pares, tempoEscala) {
        for (let i = 0; i < 6; i++) {
            for (const par of pares) {
                par.resolverSeparacao();
            }
            for (const par of pares) {
                par.resolverPosicao(tempoEscala);
            }
        }
    }
    _resolverImpulso(corpos) {
        for (const corpo of corpos) {
            corpo.ajustarColisao();
        }
    }
    _prepararResolucaoColisao(pares) {
        for (const par of pares) {
            par.prepararResolucaoColisao();
        }
    }
    _resolverColisao(pares, tempoEscala) {
        for (let i = 0; i < 4; i++) {
            for (const par of pares) {
                par.resolverColisao(tempoEscala);
            }
        }
    }
    _dispararEventoColisaoEncerrada(pares) {
        if (this.eventos.onColisaoEncerrada) {
            const colisoes = pares.filter(_ => _.colisaoEncerrada).map(_ => _.colisaoAnterior);
            this.eventos.onColisaoEncerrada(this.mundo, colisoes);
        }
    }
    _resetar(corpos) {
        corpos.forEach(_ => _.resetar());
    }
}
//# sourceMappingURL=Motor2d.js.map
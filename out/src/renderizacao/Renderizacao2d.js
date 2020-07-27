export class Renderizacao2d {
    constructor(mundo, camera) {
        this.formas = this._formasPathD(mundo, camera);
        this.areas = this._areasPathD(mundo, camera);
        this.contatos = this._contatosPathD(mundo, camera);
        this.bordas = this._bordasPathD(mundo, camera);
        this.eixos = this._eixosPathD(mundo, camera);
        this.eixo = this._eixoPathD(mundo, camera);
        this.velocidades = this._velocidadesPathD(mundo, camera);
        this.centros = this._centrosPathD(mundo, camera);
        this.dormindos = this._dormindosPathD(mundo, camera);
    }
    _bordasPathD(mundo, camera) {
        let pathDs = new Array();
        for (const corpo of mundo.corpos) {
            for (const forma of corpo.formas) {
                if (forma.bordas.sobrepoem(camera.bordas)) {
                    const min = forma.bordas.min.adic(camera.ajuste);
                    const max = forma.bordas.max.adic(camera.ajuste);
                    pathDs.push(`M${min.x},${min.y}L${max.x},${min.y}L${max.x},${max.y}L${min.x},${max.y}Z`);
                }
            }
        }
        return pathDs.join(" ");
    }
    _formasPathD(mundo, camera) {
        let pathDs = new Array();
        for (const corpo of mundo.corpos) {
            for (const forma of corpo.formas) {
                if (forma.bordas.sobrepoem(camera.bordas)) {
                    const vertices = forma.vertices.adic(camera.ajuste);
                    pathDs.push(`${vertices.reduce((a, c, i) => a += `${i == 0 ? "M" : "L"}${c.x},${c.y}`, "")}Z`);
                }
            }
        }
        return pathDs.join(" ");
    }
    _eixosPathD(mundo, camera) {
        let pathDs = new Array();
        for (const corpo of mundo.corpos) {
            for (const forma of corpo.formas) {
                if (forma.bordas.sobrepoem(camera.bordas)) {
                    let eixos = new Array();
                    const posicao = forma.posicao.adic(camera.ajuste);
                    forma.eixos.forEach(_ => eixos.push(_.mult(10).adic(posicao)));
                    pathDs.push(`${eixos.reduce((a, c, i) => `${a}M${posicao.x},${posicao.y}L${c.x},${c.y}`, "")}`);
                }
            }
        }
        return pathDs.join(" ");
    }
    _eixoPathD(mundo, camera) {
        let pathDs = new Array();
        for (const corpo of mundo.corpos) {
            for (const forma of corpo.formas) {
                if (forma.bordas.sobrepoem(camera.bordas)) {
                    const posicao = forma.posicao.adic(camera.ajuste);
                    let eixo = forma.eixos[0].mult(20).adic(posicao);
                    pathDs.push(`M${posicao.x},${posicao.y}L${eixo.x},${eixo.y}`);
                }
            }
        }
        return pathDs.join(" ");
    }
    _areasPathD(mundo, camera) {
        let pathDs = new Array();
        for (const area of mundo.areas.filter(_ => _.par)) {
            if (area.bordas.sobrepoem(camera.bordas)) {
                const vetores = area.bordas.obterVetores();
                vetores.forEach(_ => _.adicV(camera.ajuste));
                pathDs.push(`${vetores.reduce((a, c, i) => a += `${i == 0 ? "M" : "L"}${c.x},${c.y}`, "")}Z`);
            }
        }
        return pathDs.join(" ");
    }
    _contatosPathD(mundo, camera) {
        let pathDs = new Array();
        for (const par of Object.values(mundo.pares).filter(_ => _.colisao)) {
            for (const contato of par.colisao.contatos) {
                if (camera.bordas.contem(contato)) {
                    let vetor = contato.adic(camera.ajuste);
                    pathDs.push(this._desenharQuadrado(vetor, 8));
                }
            }
        }
        return pathDs.join(" ");
    }
    _velocidadesPathD(mundo, camera) {
        let pathDs = new Array();
        for (const corpo of mundo.corpos) {
            if (camera.bordas.contem(corpo.posicao)) {
                const posicao = corpo.posicao.adic(camera.ajuste);
                const velocidade = corpo.velocidade.mult(10).inv().adic(posicao);
                pathDs.push(`M${posicao.x},${posicao.y}L${velocidade.x},${velocidade.y}`);
            }
        }
        return pathDs.join(" ");
    }
    _centrosPathD(mundo, camera) {
        let pathDs = new Array();
        for (const corpo of mundo.corpos.filter(_ => !_.dormindo)) {
            if (camera.bordas.contem(corpo.posicao)) {
                const posicao = corpo.posicao.adic(camera.ajuste);
                pathDs.push(this._desenharQuadrado(posicao, 5));
            }
        }
        return pathDs.join(" ");
    }
    _dormindosPathD(mundo, camera) {
        let pathDs = new Array();
        for (const corpo of mundo.corpos.filter(_ => _.dormindo)) {
            if (camera.bordas.contem(corpo.posicao)) {
                const posicao = corpo.posicao.adic(camera.ajuste);
                pathDs.push(this._desenharQuadrado(posicao, 5));
            }
        }
        return pathDs.join(" ");
    }
    _desenharQuadrado(vetor, tamanho) {
        return `M${vetor.x - tamanho / 2},${vetor.y - tamanho / 2}L${vetor.x + tamanho / 2},${vetor.y - tamanho / 2}L${vetor.x + tamanho / 2},${vetor.y + tamanho / 2}L${vetor.x - tamanho / 2},${vetor.y + tamanho / 2}Z`;
    }
}
//# sourceMappingURL=Renderizacao2d.js.map
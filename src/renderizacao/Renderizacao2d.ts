import { Mundo2d } from "../objetos/Mundo2d";
import { Forma2d } from "../geometria/Forma2d";
import { Camera2d } from "./Camera2d";
import { Par2d } from "../colisao/Pares2d";
import { Vetor2d, IReadOnlyVetor2d } from "../geometria/Vetor2d";
import { Corpo2d } from "../objetos/Corpo2d";

export interface IRenderizacao2dOpcoes {
    logCorpos?: string[]
}

export class Renderizacao2d {
    formas: string;
    bordas: string;
    eixos: string;
    eixo: string;
    areas: string;
    contatos: string;
    velocidades: string;
    centros: string;
    dormindos: string;
    logCorpos: string[];
    restricoes: string;
    constructor(mundo: Mundo2d, camera: Camera2d, opcoes: IRenderizacao2dOpcoes) {
        const op  = opcoes ?? {};
        this.formas = this._formasPathD(mundo, camera);
        this.areas = this._areasPathD(mundo, camera);
        this.contatos = this._contatosPathD(mundo, camera);
        this.bordas = this._bordasPathD(mundo, camera);
        this.eixos = this._eixosPathD(mundo, camera);
        this.eixo = this._eixoPathD(mundo, camera);
        this.velocidades = this._velocidadesPathD(mundo, camera);
        this.centros = this._centrosPathD(mundo, camera);
        this.dormindos = this._dormindosPathD(mundo, camera);
        this.logCorpos = this._logCorpo(mundo, op.logCorpos);
        this.restricoes = this._restricoesPathD(mundo, camera);
    }

    private _bordasPathD(mundo: Mundo2d, camera: Camera2d): string {
        let pathDs = new Array<string>();
        for(const corpo of mundo.corpos) {
            for(const forma of corpo.formas) {
                if (forma.bordas.sobrepoem(camera.bordas)) {
                    const min = forma.bordas.min.adic(camera.ajuste);
                    const max = forma.bordas.max.adic(camera.ajuste);
                    pathDs.push(`M${min.x},${min.y}L${max.x},${min.y}L${max.x},${max.y}L${min.x},${max.y}Z`);
                }
            }
        }
       
        return pathDs.join(" ");
    }

    private _formasPathD(mundo: Mundo2d, camera: Camera2d): string {
        let pathDs = new Array<string>();
        for(const corpo of mundo.corpos) {
            for(const forma of corpo.formas) {
                if (forma.bordas.sobrepoem(camera.bordas)) {
                    const vertices = forma.vertices.adic(camera.ajuste);
                    pathDs.push(`${vertices.reduce((a,c, i) => a+=`${i==0?"M":"L"}${c.x},${c.y}`, "")}Z`);
                }
            }
        }
       
        return pathDs.join(" ");
    }

    private _eixosPathD(mundo: Mundo2d, camera: Camera2d): string {
        let pathDs = new Array<string>();
        for(const corpo of mundo.corpos) {
            for(const forma of corpo.formas) {
                if (forma.bordas.sobrepoem(camera.bordas)) {
                    let eixos = new Array<IReadOnlyVetor2d>();
                    const posicao = forma.posicao.adic(camera.ajuste);
                    forma.eixos.forEach(_ => eixos.push(_.mult(10).adic(posicao)));
                    pathDs.push(`${eixos.reduce((a,c,i) => `${a}M${posicao.x},${posicao.y}L${c.x},${c.y}`, "")}`);
                }
            }
        }
       
        return pathDs.join(" ");
    }

    private _eixoPathD(mundo: Mundo2d, camera: Camera2d): string {
        let pathDs = new Array<string>();
        for(const corpo of mundo.corpos) {
            for(const forma of corpo.formas) {
                if (forma.bordas.sobrepoem(camera.bordas)) {
                    const posicao = forma.posicao.adic(camera.ajuste);
                    let eixo = forma.eixos[0].mult(20).adic(posicao);
                    pathDs.push(`M${posicao.x},${posicao.y}L${eixo.x},${eixo.y}`);
                }
            }
        }
       
        return pathDs.join(" ");
    }

    private _areasPathD(mundo: Mundo2d, camera: Camera2d): string {
        let pathDs = new Array<string>();
        for(const area of mundo.areas.filter(_ => _.par)) {
            if (area.bordas.sobrepoem(camera.bordas)) {
                const vetores = area.bordas.obterVetores()
                vetores.forEach(_ => _.adicV(camera.ajuste));
                pathDs.push(`${vetores.reduce((a,c, i) => a+=`${i==0?"M":"L"}${c.x},${c.y}`, "")}Z`);
            }
        }
       
        return pathDs.join(" ");
    }

    private _contatosPathD(mundo: Mundo2d, camera: Camera2d) {
        let pathDs = new Array<string>();
        for(const par of (<any>Object).values(mundo.pares).filter(_ => _.colisao)) {
            for(const contato of (<Par2d>par).colisao.contatos) {
                if (camera.bordas.contem(contato)) {
                    let vetor = contato.adic(camera.ajuste);
                    pathDs.push(this._desenharQuadrado(vetor, 8));
                }
            }
        }

        return pathDs.join(" ");
    }


    private _velocidadesPathD(mundo: Mundo2d, camera: Camera2d) {
        let pathDs = new Array<string>();
        for(const corpo of mundo.corpos) {
            if (camera.bordas.contem(corpo.posicao)) {
                const posicao = corpo.posicao.adic(camera.ajuste);
                const velocidade = corpo.velocidade.mult(10).inv().adic(posicao);
                pathDs.push(`M${posicao.x},${posicao.y}L${velocidade.x},${velocidade.y}`);
            }
        }

        return pathDs.join(" ");
    }

    private _centrosPathD(mundo: Mundo2d, camera: Camera2d) {
        let pathDs = new Array<string>();
        for(const corpo of mundo.corpos.filter(_ => !_.dormindo)) {
            if (camera.bordas.contem(corpo.posicao)) {
                const posicao = corpo.posicao.adic(camera.ajuste);
                pathDs.push(this._desenharQuadrado(posicao, 5));
            }
        }
        return pathDs.join(" ");
    }

    private _dormindosPathD(mundo: Mundo2d, camera: Camera2d) {
        let pathDs = new Array<string>();
        for(const corpo of mundo.corpos.filter(_ => _.dormindo)) {
            if (camera.bordas.contem(corpo.posicao)) {
                const posicao = corpo.posicao.adic(camera.ajuste);
                pathDs.push(this._desenharQuadrado(posicao, 5));
            }
        }
        return pathDs.join(" ");
    }

    private _restricoesPathD(mundo: Mundo2d, camera: Camera2d): string {
        let pathDs = new Array<string>();
        for(const restricao of mundo.restricoes) {
            if (camera.bordas.contem(restricao.mundoPontoA) || camera.bordas.contem(restricao.mundoPontoB)) {
                pathDs.push(`M${restricao.mundoPontoA.x},${restricao.mundoPontoA.y}L${restricao.mundoPontoB.x},${restricao.mundoPontoB.y}`);
            }
        }
        return pathDs.join(" ");
    }

    private _logCorpo(mundo:Mundo2d, nomeCorpos: string[]) {
        let logCorpos = new Array<string>();
        if (nomeCorpos) {
            let vetor2dToString = (v: IReadOnlyVetor2d) => { return `{ x: ${Math.round(v.x*100)/100}, y: ${Math.round(v.y*100)/100} }`}
            for(const nomeCorpo of nomeCorpos) {
                for(const corpo of mundo.corpos.filter(_ => _.nome == nomeCorpo)) {
                    logCorpos.push(`nome       : ${corpo.nome}`);
                    logCorpos.push(`posicao    : ${vetor2dToString(corpo.posicao)}`);
                    logCorpos.push(`velocidade : ${vetor2dToString(corpo.velocidade)}`);
                    logCorpos.push(`rapidez    : ${Math.round(corpo.rapidez*100)/100}`);
                    logCorpos.push(`angulo     : ${Math.round(corpo.angulo*100)/100}`);
                    logCorpos.push(`vel. ang.  : ${Math.round(corpo.velocidadeAngular*100)/100}`);
                    logCorpos.push(`movimento  : ${Math.round(corpo.movimento*100)/100}`);
                    logCorpos.push(`dormindo   : ${corpo.dormindo}`);
                }
            }
        }
        return logCorpos;
    }


    private _desenharQuadrado(vetor:IReadOnlyVetor2d, tamanho: number): string {
        return `M${vetor.x-tamanho/2},${vetor.y-tamanho/2}L${vetor.x+tamanho/2},${vetor.y-tamanho/2}L${vetor.x+tamanho/2},${vetor.y+tamanho/2}L${vetor.x-tamanho/2},${vetor.y+tamanho/2}Z`
    }
}
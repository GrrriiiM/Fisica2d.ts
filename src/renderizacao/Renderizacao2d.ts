import { Mundo2d } from "../objetos/Mundo2d";
import { Forma2d } from "../geometria/Forma2d";
import { Camera2d } from "./Camera2d";
import { Par2d } from "../colisao/Pares2d";
import { Vetor2d } from "../geometria/Vetor2d";

export class Renderizacao2d {
    formas: string;
    areas: string;
    contatos: string;
    constructor(mundo: Mundo2d, camera: Camera2d) {
        this.formas = this._formasPathD(mundo, camera);
        this.areas = this._areasPathD(mundo, camera);
        this.contatos = this._contatosPathD(mundo, camera);
    }

    private _formasPathD(mundo: Mundo2d, camera: Camera2d): string {
        let pathDs = new Array<string>();
        for(const corpo of mundo.corpos) {
            for(const forma of corpo.partes) {
                if (forma.bordas.sobrepoem(camera.bordas)) {
                    const vertices = forma.vertices.adic(camera.ajuste);
                    pathDs.push(`${vertices.reduce((a,c, i) => a+=`${i==0?"M":"L"}${c.x},${c.y}`, "")}Z`);
                }
            }
        }
       
        return pathDs.join(" ");
    }

    private _areasPathD(mundo: Mundo2d, camera: Camera2d): string {
        let pathDs = new Array<string>();
        for(const area of mundo.areas.filter(_ => _.formas.length>1)) {
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
        for(const par of (<any>Object).values(mundo.pares)) {
            for(const contatos of (<Par2d>par).contatos) {
                let vetor = contatos.vetor.adic(camera.ajuste);
                pathDs.push(this._desenharQuadrado(vetor, 8));
            }
        }

        return pathDs.join(" ");
    }

    private _desenharQuadrado(vetor:Vetor2d, tamanho: number): string {
        return `M${vetor.x-tamanho/2},${vetor.y-tamanho/2}L${vetor.x+tamanho/2},${vetor.y-tamanho/2}L${vetor.x+tamanho/2},${vetor.y+tamanho/2}L${vetor.x-tamanho/2},${vetor.y+tamanho/2}Z`
    }
}
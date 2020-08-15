import { Forma2d, IForma2dOpcoes } from "./Forma2d";
import { Vetor2d, IReadOnlyVetor2d } from "./Vetor2d";
import { Corpo2d, ICorpo2dOpcoes } from "../objetos/Corpo2d";

export interface IConstrutorCorpo2dOpcoes extends ICorpo2dOpcoes {
}

export interface IConstrutorForma2dOpcoes extends ICorpo2dOpcoes {
    x?: number,
    y?: number
}

export class Construtor2d {

    static Corpo(x: number, y: number, formas: Forma2d[], opcoes?: IConstrutorCorpo2dOpcoes) {
        return new Corpo2d(new Vetor2d(x, y), formas, opcoes);
    };
    

    static Quadrado(tamanho: number, opcoes?: IForma2dOpcoes): Forma2d {
        return this.Retangulo(tamanho, tamanho, opcoes);
    }

    static Retangulo(largura: number, altura, opcoes?: IConstrutorForma2dOpcoes): Forma2d {
        const vetores = [new Vetor2d(0,0), new Vetor2d(0,altura), new Vetor2d(largura,altura), new Vetor2d(largura,0)];
        return this.PoligonoConvexoVetores(vetores, opcoes);
    }

    static TrianguloReto(largura: number, altura: number, inverter: boolean, opcoes?: IConstrutorForma2dOpcoes): Forma2d {
        const vetores = [new Vetor2d(!inverter ? 0 : largura, 0), new Vetor2d(largura,altura), new Vetor2d(0,altura)];
        return this.PoligonoConvexoVetores(vetores, opcoes);
    }

    static Circulo(raio: number, opcoes?: IConstrutorForma2dOpcoes): Forma2d {
        const maximoLados = 25;
        var lados = Math.ceil(Math.max(10, Math.min(maximoLados, raio)));

        if (lados % 2 === 1) lados += 1;
        return this.PoligonoConvexoLados(lados, raio, opcoes);
    }


    static PoligonoConvexoLados(lados: number, raio: number, opcoes?: IConstrutorForma2dOpcoes): Forma2d {
        const vetores = new Array<Vetor2d>();

        if (lados < 3) lados = 4;

        const theta = 2 * Math.PI / lados;
        const offset = theta * 0.5;

        for(let i=0;i<lados;i++) {
            const angulo = offset + (i * theta);
            vetores.push(new Vetor2d(Math.cos(angulo) * raio, Math.sin(angulo) * raio));
        }

        return this.PoligonoConvexoVetores(vetores, opcoes);
    }


    static PoligonoConvexoVetores(vetores: IReadOnlyVetor2d[], opcoes?: IConstrutorForma2dOpcoes): Forma2d {
        const op = opcoes || {};
        return new Forma2d(new Vetor2d(op.x ?? 0, op.y ?? 0), vetores, op);
    }


    
}
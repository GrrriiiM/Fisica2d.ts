import { Forma2d } from "./Forma2d";
import { Vetor2d, IReadOnlyVetor2d } from "./Vetor2d";
import { Corpo2d, ICorpo2dOpcoes } from "../objetos/Corpo2d";

export interface IConstrutor2dOpcoes extends ICorpo2dOpcoes {
}

export class Construtor2d {

    static Quadrado(x: number, y: number, tamanho: number, opcoes?: IConstrutor2dOpcoes): Corpo2d {
        return this.Retangulo(x , y, tamanho, tamanho, opcoes);
    }

    static Retangulo(x: number, y: number, largura: number, altura, opcoes?: IConstrutor2dOpcoes): Corpo2d {
        const vetores = [new Vetor2d(0,0), new Vetor2d(0,altura), new Vetor2d(largura,altura), new Vetor2d(largura,0)];
        return this.PoligonoConvexoVetores(x, y, vetores, opcoes);
    }

    static trianguloReto(x: number, y: number, largura: number, altura: number, inverter: boolean, opcoes?: IConstrutor2dOpcoes): Corpo2d {
        const vetores = [new Vetor2d(!inverter ? 0 : largura, 0), new Vetor2d(largura,altura), new Vetor2d(0,altura)];
        return this.PoligonoConvexoVetores(x, y, vetores, opcoes);
    }

    static Circulo(x: number, y: number, raio: number, opcoes?: IConstrutor2dOpcoes): Corpo2d {
        const maximoLados = 25;
        var lados = Math.ceil(Math.max(10, Math.min(maximoLados, raio)));

        if (lados % 2 === 1) lados += 1;
        return this.PoligonoConvexoLados(x, y, lados, raio, opcoes);
    }


    static PoligonoConvexoLados(x: number, y: number, lados: number, raio: number, opcoes?: IConstrutor2dOpcoes): Corpo2d {
        const vetores = new Array<Vetor2d>();

        if (lados < 3) lados = 4;

        const theta = 2 * Math.PI / lados;
        const offset = theta * 0.5;

        for(let i=0;i<lados;i++) {
            const angulo = offset + (i * theta);
            vetores.push(new Vetor2d(Math.cos(angulo) * raio, Math.sin(angulo) * raio));
        }

        return this.PoligonoConvexoVetores(x, y, vetores, opcoes);
    }


    static PoligonoConvexoVetores(x: number, y: number, vetores: IReadOnlyVetor2d[], opcoes?: IConstrutor2dOpcoes): Corpo2d {
        const posicao = new Vetor2d(x, y);
        return new Corpo2d(posicao, [new Forma2d(posicao, vetores)], opcoes);
    }


    
}
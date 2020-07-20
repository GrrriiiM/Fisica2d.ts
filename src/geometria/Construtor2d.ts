import { Forma2d } from "./Forma2d";
import { Vetor2d } from "./Vetor2d";
import { Corpo2d, ICorpo2dOpcoes } from "../objetos/Corpo2d";

export interface IConstrutor2dOpcoes extends ICorpo2dOpcoes {
}

export class Construtor2d {

    static Quadrado(x: number, y: number, tamanho: number, opcoes?: IConstrutor2dOpcoes): Corpo2d {
        return this.Retangulo(x , y, tamanho, tamanho, opcoes);
    }

    static Retangulo(x: number, y: number, largura: number, altura, opcoes?: IConstrutor2dOpcoes): Corpo2d {
        const vetores = [new Vetor2d(0,0), new Vetor2d(0,altura), new Vetor2d(largura,altura), new Vetor2d(largura,0)];
        return this.PoligonoConvexo(x, y, vetores, opcoes);
    }

    static PoligonoConvexo(x: number, y: number, vetores: Vetor2d[], opcoes?: IConstrutor2dOpcoes): Corpo2d {
        const posicao = new Vetor2d(x, y);
        return new Corpo2d(posicao, [new Forma2d(posicao, vetores)], opcoes);
    }


    
}
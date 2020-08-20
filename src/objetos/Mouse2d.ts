import { Vetor2d } from "../geometria/Vetor2d";
import { Corpo2d } from "./Corpo2d";

export class Mouse2d {
    private readonly _posicao: Vetor2d = new Vetor2d()
    get posicao() { return this._posicao; }

    corpo: Corpo2d;

    set(x:number, y:number) {
        this._posicao.set(x, y);
    }


    
}
import { Vetor2d } from "../geometria/Vetor2d";
import { Bordas2d } from "../geometria/Bordas2d";

export class Camera2d {

    readonly bordas: Bordas2d;

    constructor(
        private largura: number,
        private altura: number,
        private zoom = 1,
        public ajuste = new Vetor2d()
    ) {
        this.bordas = new Bordas2d(new Vetor2d(0, 0), new Vetor2d(this.largura, this.altura));
    }

    mover(x: number, y: number) {
        const vetor = new Vetor2d(x , y);
        this.bordas.min.adicV(vetor);
        this.bordas.max.adicV(vetor);
        this.ajuste.adicV(vetor.inv());
    }
}
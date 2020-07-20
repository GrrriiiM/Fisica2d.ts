import { Bordas2d } from "../geometria/Bordas2d";
import { Corpo2d } from "../objetos/Corpo2d";
import { Forma2d } from "../geometria/Forma2d";

export class Area2d {
    readonly id: string;
    readonly bordas: Bordas2d;
    readonly formas = new Array<Forma2d>();
    constructor(
        readonly linha: number,
        readonly coluna: number,
        readonly tamanho: number
    ) {
        this.id = `${this.linha}_${this.coluna}`;
        this.bordas = new Bordas2d(this.coluna*this.tamanho, this.linha*this.tamanho, (this.coluna+1)*this.tamanho, (this.linha+1)*this.tamanho)
    }
}
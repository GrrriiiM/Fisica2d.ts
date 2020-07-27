import { Bordas2d } from "../geometria/Bordas2d.js";
export class Area2d {
    constructor(linha, coluna, tamanho) {
        this.linha = linha;
        this.coluna = coluna;
        this.tamanho = tamanho;
        this.formas = new Array();
        this.par = false;
        this.id = `${this.linha}_${this.coluna}`;
        this.bordas = new Bordas2d(this.coluna * this.tamanho, this.linha * this.tamanho, (this.coluna + 1) * this.tamanho, (this.linha + 1) * this.tamanho);
    }
}
//# sourceMappingURL=Area2d.js.map
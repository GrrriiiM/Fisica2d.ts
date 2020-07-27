import { Forma2d } from "./Forma2d.js";
import { Vetor2d } from "./Vetor2d.js";
import { Corpo2d } from "../objetos/Corpo2d.js";
export class Construtor2d {
    static Quadrado(x, y, tamanho, opcoes) {
        return this.Retangulo(x, y, tamanho, tamanho, opcoes);
    }
    static Retangulo(x, y, largura, altura, opcoes) {
        const vetores = [new Vetor2d(0, 0), new Vetor2d(0, altura), new Vetor2d(largura, altura), new Vetor2d(largura, 0)];
        return this.PoligonoConvexoVetores(x, y, vetores, opcoes);
    }
    static trianguloReto(x, y, largura, altura, inverter, opcoes) {
        const vetores = [new Vetor2d(!inverter ? 0 : largura, 0), new Vetor2d(largura, altura), new Vetor2d(0, altura)];
        return this.PoligonoConvexoVetores(x, y, vetores, opcoes);
    }
    static Circulo(x, y, raio, opcoes) {
        const maximoLados = 25;
        var lados = Math.ceil(Math.max(10, Math.min(maximoLados, raio)));
        if (lados % 2 === 1)
            lados += 1;
        return this.PoligonoConvexoLados(x, y, lados, raio, opcoes);
    }
    static PoligonoConvexoLados(x, y, lados, raio, opcoes) {
        const vetores = new Array();
        if (lados < 3)
            lados = 4;
        const theta = 2 * Math.PI / lados;
        const offset = theta * 0.5;
        for (let i = 0; i < lados; i++) {
            const angulo = offset + (i * theta);
            vetores.push(new Vetor2d(Math.cos(angulo) * raio, Math.sin(angulo) * raio));
        }
        return this.PoligonoConvexoVetores(x, y, vetores, opcoes);
    }
    static PoligonoConvexoVetores(x, y, vetores, opcoes) {
        const posicao = new Vetor2d(x, y);
        return new Corpo2d(posicao, [new Forma2d(posicao, vetores)], opcoes);
    }
}
//# sourceMappingURL=Construtor2d.js.map
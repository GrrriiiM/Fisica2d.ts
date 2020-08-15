import { Forma2d } from "./Forma2d.js";
import { Vetor2d } from "./Vetor2d.js";
import { Corpo2d } from "../objetos/Corpo2d.js";
export class Construtor2d {
    static Corpo(x, y, formas, opcoes) {
        return new Corpo2d(new Vetor2d(x, y), formas, opcoes);
    }
    ;
    static Quadrado(tamanho, opcoes) {
        return this.Retangulo(tamanho, tamanho, opcoes);
    }
    static Retangulo(largura, altura, opcoes) {
        const vetores = [new Vetor2d(0, 0), new Vetor2d(0, altura), new Vetor2d(largura, altura), new Vetor2d(largura, 0)];
        return this.PoligonoConvexoVetores(vetores, opcoes);
    }
    static TrianguloReto(largura, altura, inverter, opcoes) {
        const vetores = [new Vetor2d(!inverter ? 0 : largura, 0), new Vetor2d(largura, altura), new Vetor2d(0, altura)];
        return this.PoligonoConvexoVetores(vetores, opcoes);
    }
    static Circulo(raio, opcoes) {
        const maximoLados = 25;
        var lados = Math.ceil(Math.max(10, Math.min(maximoLados, raio)));
        if (lados % 2 === 1)
            lados += 1;
        return this.PoligonoConvexoLados(lados, raio, opcoes);
    }
    static PoligonoConvexoLados(lados, raio, opcoes) {
        const vetores = new Array();
        if (lados < 3)
            lados = 4;
        const theta = 2 * Math.PI / lados;
        const offset = theta * 0.5;
        for (let i = 0; i < lados; i++) {
            const angulo = offset + (i * theta);
            vetores.push(new Vetor2d(Math.cos(angulo) * raio, Math.sin(angulo) * raio));
        }
        return this.PoligonoConvexoVetores(vetores, opcoes);
    }
    static PoligonoConvexoVetores(vetores, opcoes) {
        var _a, _b;
        const op = opcoes || {};
        return new Forma2d(new Vetor2d((_a = op.x) !== null && _a !== void 0 ? _a : 0, (_b = op.y) !== null && _b !== void 0 ? _b : 0), vetores, op);
    }
}
//# sourceMappingURL=Construtor2d.js.map
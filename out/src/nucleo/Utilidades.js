export class Utilidades {
    static Preencher(alvo, valores, preFixo = "") {
        for (let campo of Object.keys(valores)) {
            if (alvo[`${preFixo}${campo}`]) {
                alvo[`${preFixo}${campo}`] = valores[campo];
            }
        }
    }
}
//# sourceMappingURL=Utilidades.js.map
export class Utilidades {
    static Preencher(alvo: any, valores: any, preFixo:string = "") {
        for(let campo of Object.keys(valores)) {
            if (alvo[`${preFixo}${campo}`]) {
                alvo[`${preFixo}${campo}`] = valores[campo];
            }
        }
    }
}
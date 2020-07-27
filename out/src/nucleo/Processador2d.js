import { Renderizacao2d } from "../renderizacao/Renderizacao2d.js";
export class Processador2d {
    constructor(motor) {
        this.motor = motor;
    }
    requisitarFrame(tempo, camera, frameId, opcoes) {
        this.motor.executar(tempo, 1, frameId);
        return new Renderizacao2d(this.motor.mundo, camera, opcoes);
    }
}
//# sourceMappingURL=Processador2d.js.map
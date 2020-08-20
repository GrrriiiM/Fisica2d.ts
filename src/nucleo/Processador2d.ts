import { Motor2d } from "./motor2d";
import { IProcessador2d } from "../renderizacao/IProcessador2d";
import { Camera2d } from "../renderizacao/Camera2d";
import { Renderizacao2d, IRenderizacao2dOpcoes } from "../renderizacao/Renderizacao2d";

export class Processador2d implements IProcessador2d {
    constructor(
        private motor: Motor2d,
    ) {}


    requisitarFrame(tempo: number, camera: Camera2d, frameId: number, opcoes: IRenderizacao2dOpcoes): Renderizacao2d {
        this.motor.executar(tempo, 1, frameId);
        return new Renderizacao2d(this.motor.mundo, camera, opcoes);
    }

    atualizarMouse(x: number, y: number, click1: boolean, click2: boolean) {
        this.motor.mundo.atualizarMouse(x, y, click1, click2);
    }

    
}
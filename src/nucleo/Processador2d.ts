import { Motor2d } from "./motor2d";
import { IProcessador2d } from "../renderizacao/IProcessador2d";
import { Camera2d } from "../renderizacao/camera2d";
import { Renderizacao2d } from "../renderizacao/Renderizacao2d";

export class Processador2d implements IProcessador2d {
    constructor(
        private motor: Motor2d,
    ) {}


    requisitarFrame(tempo: number, camera: Camera2d): Renderizacao2d {
        this.motor.executar(tempo, 1);
        return new Renderizacao2d(this.motor.mundo, camera);
    }

    
}
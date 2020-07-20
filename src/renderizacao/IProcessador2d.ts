import { Renderizacao2d } from "./Renderizacao2d";
import { Camera2d } from "./Camera2d";

export interface IProcessador2d {
    requisitarFrame(tempo: number, camera: Camera2d): Renderizacao2d;
}
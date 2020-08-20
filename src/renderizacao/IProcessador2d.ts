import { Renderizacao2d, IRenderizacao2dOpcoes } from "./Renderizacao2d";
import { Camera2d } from "./Camera2d";

export interface IProcessador2d {
    requisitarFrame(tempo: number, camera: Camera2d, frameId: number, opcoes: IRenderizacao2dOpcoes): Renderizacao2d;
    atualizarMouse(x: number, y: number, click1: boolean, click2: boolean);
}
import { Mundo2d } from "../objetos/Mundo2d"
import { Colisao2d } from "../colisao/Colisao2d"


export class Eventos2d {
    public onColisaoIniciada: (mundo: Mundo2d, colisao: Colisao2d[]) => void = null;
    public onColisaoEncerrada: (mundo: Mundo2d, colisao: Colisao2d[]) => void = null;
}
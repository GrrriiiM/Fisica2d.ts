import { Camera2d } from "./camera2d";
import { Vetor2d } from "../geometria/Vetor2d";
import { Processador2d } from "../nucleo/processador2d";
import { IProcessador2d } from "./IProcessador2d";
import { Renderizacao2d } from "./renderizacao2d";

export class Canvas2d {
    readonly elementoHtml: string;
    readonly largura: number;
    readonly altura: number;
    private frameId = 0;
    private executando = false;
    private tempoFrame = 0;
    private tempoTotal = 0;
    private readonly _context: CanvasRenderingContext2D;
    private readonly camera: Camera2d;
    private requisitarFrame: (callback: FrameRequestCallback) => number;
    constructor(
        readonly processador: IProcessador2d,
        {
            elementoQuerySelector = "body",
            largura = 500,
            altura = 500
        } = {}
    ) {
        let element = document.querySelector(elementoQuerySelector);
        this.altura = altura;
        this.largura = largura;
        let canvas = document.createElement("canvas");
        this._context = canvas.getContext("2d");
        canvas.height = this.altura;
        canvas.width = this.largura;
        element.appendChild(canvas);

        if (typeof window !== 'undefined') {
            if (window.requestAnimationFrame) this.requisitarFrame = (render) => window.requestAnimationFrame(render)
            else if (window.webkitRequestAnimationFrame) this.requisitarFrame = (render) =>  window.webkitRequestAnimationFrame(render);
        }

        this.camera = new Camera2d(this.largura, this.altura);

        this.executar.bind(this);
    }

    iniciar() {
        this.executando = true;
        this.executar(0);
    }

    executar(tempo) {
        this.tempoFrame = tempo - this.tempoTotal;
        this.tempoTotal = tempo;
        if (this.executando) {
            this.renderizar(this.processador.requisitarFrame(this.tempoFrame, this.camera, this.frameId));
            this.frameId = this.requisitarFrame(this.executar.bind(this));
        }
    }

    moverCamera(x: number, y: number) {
        this.camera.mover(x, y);
    }

    renderizar(renderizacao: Renderizacao2d) {
        this.renderizarFundo();
        this.renderizarBordas(renderizacao.bordas);
        this.renderizarEixos(renderizacao.eixos);
        this.renderizarAreas(renderizacao.areas);
        this.renderizarFormas(renderizacao.formas);
        this.renderizarContatos(renderizacao.contatos);
        this.renderizarVelocidades(renderizacao.velocidades);
    }

    renderizarFundo() {
        this._context.fillStyle = "black";
        this._context.fill(new Path2D(`M0 0 L${this.largura} 0 L${this.largura} ${this.altura} L0 ${this.altura}`));
    }

    renderizarBordas(pathD: string) {
        this._context.strokeStyle = "green";
        this._context.stroke(new Path2D(pathD));
    }

    renderizarEixos(pathD: string) {
        this._context.strokeStyle = "purple";
        this._context.stroke(new Path2D(pathD));
    }

    renderizarFormas(pathD: string) {
        this._context.strokeStyle = "white";
        this._context.stroke(new Path2D(pathD));
    }

    renderizarAreas(pathD: string) {
        this._context.strokeStyle = "red";
        this._context.globalAlpha = 0.5;
        this._context.stroke(new Path2D(pathD));
        this._context.globalAlpha = 1;
    }

    renderizarContatos(pathD: string) {
        this._context.fillStyle = "lime";
        this._context.fill(new Path2D(pathD));
    }

    renderizarVelocidades(pathD: string) {
        this._context.strokeStyle = "blue";
        this._context.stroke(new Path2D(pathD));
    }


}

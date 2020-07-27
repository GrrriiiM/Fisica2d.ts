import { Camera2d } from "./Camera2d.js";
export class Canvas2d {
    constructor(processador, { elementoQuerySelector = "body", largura = 500, altura = 500 } = {}) {
        this.processador = processador;
        this.frameId = 0;
        this.executando = false;
        this.tempoFrame = 0;
        this.tempoTotal = 0;
        let element = document.querySelector(elementoQuerySelector);
        this.altura = altura;
        this.largura = largura;
        let canvas = document.createElement("canvas");
        this._context = canvas.getContext("2d");
        canvas.height = this.altura;
        canvas.width = this.largura;
        element.appendChild(canvas);
        if (typeof window !== 'undefined') {
            if (window.requestAnimationFrame)
                this.requisitarFrame = (render) => window.requestAnimationFrame(render);
            else if (window.webkitRequestAnimationFrame)
                this.requisitarFrame = (render) => window.webkitRequestAnimationFrame(render);
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
    moverCamera(x, y) {
        this.camera.mover(x, y);
    }
    renderizar(renderizacao) {
        this.renderizarFundo();
        this.renderizarAreas(renderizacao.areas);
        this.renderizarBordas(renderizacao.bordas);
        this.renderizarEixos(renderizacao.eixos);
        this.renderizarEixoPrincipal(renderizacao.eixo);
        this.renderizarFormas(renderizacao.formas);
        this.renderizarContatos(renderizacao.contatos);
        this.renderizarVelocidades(renderizacao.velocidades);
        this.renderizarCentros(renderizacao.centros);
        this.renderizarDormindos(renderizacao.dormindos);
    }
    renderizarFundo() {
        this._context.fillStyle = "black";
        this._context.fill(new Path2D(`M0 0 L${this.largura} 0 L${this.largura} ${this.altura} L0 ${this.altura}`));
    }
    renderizarBordas(pathD) {
        this._context.strokeStyle = "green";
        this._context.stroke(new Path2D(pathD));
    }
    renderizarEixos(pathD) {
        this._context.strokeStyle = "purple";
        this._context.stroke(new Path2D(pathD));
    }
    renderizarEixoPrincipal(pathD) {
        this._context.strokeStyle = "red";
        this._context.stroke(new Path2D(pathD));
    }
    renderizarFormas(pathD) {
        this._context.strokeStyle = "white";
        this._context.stroke(new Path2D(pathD));
    }
    renderizarAreas(pathD) {
        this._context.strokeStyle = "red";
        this._context.globalAlpha = 0.5;
        this._context.stroke(new Path2D(pathD));
        this._context.globalAlpha = 1;
    }
    renderizarContatos(pathD) {
        this._context.fillStyle = "lime";
        this._context.fill(new Path2D(pathD));
    }
    renderizarVelocidades(pathD) {
        this._context.strokeStyle = "blue";
        this._context.stroke(new Path2D(pathD));
    }
    renderizarCentros(pathD) {
        this._context.fillStyle = "blue";
        this._context.fill(new Path2D(pathD));
    }
    renderizarDormindos(pathD) {
        this._context.fillStyle = "orange";
        this._context.fill(new Path2D(pathD));
    }
}
//# sourceMappingURL=Renderizador2d.js.map
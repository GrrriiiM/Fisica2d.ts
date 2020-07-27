import { Camera2d } from "./Camera2d.js";
export class Canvas2d {
    constructor(processador, opcoes) {
        var _a, _b, _c, _d;
        this.processador = processador;
        this.elementoHtml = "body";
        this.largura = 500;
        this.altura = 500;
        this.logCorpos = new Array();
        this.frameId = 0;
        this.executando = false;
        this.tempoFrame = 0;
        this.tempoTotal = 0;
        const op = opcoes !== null && opcoes !== void 0 ? opcoes : {};
        this.elementoHtml = (_a = op.elementoQuerySelector) !== null && _a !== void 0 ? _a : this.elementoHtml;
        this.largura = (_b = op.largura) !== null && _b !== void 0 ? _b : this.largura;
        this.altura = (_c = op.altura) !== null && _c !== void 0 ? _c : this.altura;
        this.logCorpos = (_d = op.logCorpos) !== null && _d !== void 0 ? _d : this.logCorpos;
        let element = document.querySelector(this.elementoHtml);
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
            this.renderizar(this.processador.requisitarFrame(this.tempoFrame, this.camera, this.frameId, { logCorpos: this.logCorpos }));
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
        this.renderizarFps(1000 / this.tempoFrame);
        this.renderizarLog(renderizacao.logCorpos);
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
    renderizarFps(fps) {
        let fpsText = `fps: ${Math.round(fps)}`;
        this._context.font = "18px Arial";
        this._context.fillStyle = "#FFFFFF";
        let fpsMeasureText = this._context.measureText(fpsText).width;
        this._context.fillText(fpsText, this.largura - fpsMeasureText, this.altura - 10);
    }
    renderizarLog(logs) {
        if (logs && logs.length) {
            this._context.fillStyle = "blue";
            this._context.globalAlpha = 0.4;
            let altura = 15 + (logs.length * 12);
            let largura = 250;
            this._context.fill(new Path2D(`M10,10,L${largura},10L${largura},${altura}L10,${altura}`));
            this._context.globalAlpha = 1;
            altura = 0;
            this._context.font = "11px Consolas";
            this._context.fillStyle = "#FFFFFF";
            for (const log of logs) {
                this._context.fillText(log, 15, 22 + altura);
                altura += 10;
            }
        }
    }
}
//# sourceMappingURL=Renderizador2d.js.map
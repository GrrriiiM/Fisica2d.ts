import { Camera2d } from "./Camera2d.js";
export class Renderizador2d {
    constructor(processador, opcoes) {
        var _a, _b, _c, _d, _e;
        this.processador = processador;
        this.elementoHtml = "body";
        this.largura = 500;
        this.altura = 500;
        this.logCorpos = new Array();
        this.frameId = 0;
        this._executando = false;
        this.tempoFrame = 0;
        this.tempoTotal = 0;
        this.debug = false;
        const op = opcoes !== null && opcoes !== void 0 ? opcoes : {};
        this.elementoHtml = (_a = op.elementoQuerySelector) !== null && _a !== void 0 ? _a : this.elementoHtml;
        this.largura = (_b = op.largura) !== null && _b !== void 0 ? _b : this.largura;
        this.altura = (_c = op.altura) !== null && _c !== void 0 ? _c : this.altura;
        this.logCorpos = (_d = op.logCorpos) !== null && _d !== void 0 ? _d : this.logCorpos;
        this.onKeypress = op.onKeypress;
        this.debug = (_e = op.debug) !== null && _e !== void 0 ? _e : false;
        let element = document.querySelector(this.elementoHtml);
        let canvas = document.createElement("canvas");
        this._context = canvas.getContext("2d");
        canvas.height = this.altura;
        canvas.width = this.largura;
        element.appendChild(canvas);
        element.addEventListener("keypress", (ev) => this._onKeypress(ev));
        element.addEventListener("mousemove", (ev) => this._onMousemove(ev));
        if (typeof window !== 'undefined') {
            if (window.requestAnimationFrame)
                this.requisitarFrame = (render) => window.requestAnimationFrame(render);
            else if (window.webkitRequestAnimationFrame)
                this.requisitarFrame = (render) => window.webkitRequestAnimationFrame(render);
        }
        this.camera = new Camera2d(this.largura, this.altura);
        this.executar.bind(this);
    }
    get executando() { return this._executando; }
    adicionarLogCorpo(nome) {
        this.logCorpos.push(nome);
    }
    iniciar() {
        this._executando = true;
        this.executar(0);
    }
    executar(tempo) {
        this.tempoFrame = tempo - this.tempoTotal;
        this.tempoTotal = tempo;
        if (this._executando) {
            this.renderizar(this.processador.requisitarFrame(this.tempoFrame, this.camera, this.frameId, { logCorpos: this.logCorpos }));
            this.frameId = this.requisitarFrame(this.executar.bind(this));
        }
    }
    parar() {
        this._executando = false;
    }
    moverCamera(x, y) {
        this.camera.mover(x, y);
    }
    _onKeypress(ev) {
        if (ev.key == "'")
            if (this._executando)
                this.parar();
            else
                this.iniciar();
        if (ev.key == "=") {
            this.parar();
            this.iniciar();
            this.parar();
        }
        if (ev.key == "-") {
            this.debug = !this.debug;
        }
        this.onKeypress && this.onKeypress(this, ev);
    }
    _onMousemove(ev) {
        this.processador.atualizarMouse(ev.x, ev.y, ev.buttons == 1, ev.buttons == 2);
    }
    renderizar(renderizacao) {
        this.renderizarFundo();
        this.debug && this.renderizarCorpoSelecionado(renderizacao.corpoSelecionado);
        this.debug && this.renderizarAreas(renderizacao.areas);
        this.debug && this.renderizarBordas(renderizacao.bordas);
        this.debug && this.renderizarEixos(renderizacao.eixos);
        this.debug && this.renderizarEixoPrincipal(renderizacao.eixo);
        this.renderizarRestricoes(renderizacao.restricoes);
        this.renderizarFormas(renderizacao.formas);
        this.debug && this.renderizarContatos(renderizacao.contatos);
        this.debug && this.renderizarVelocidades(renderizacao.velocidades);
        this.debug && this.renderizarCentros(renderizacao.centros);
        this.debug && this.renderizarDormindos(renderizacao.dormindos);
        this.debug &&
            this.debug && this.renderizarMouse(renderizacao.mouse);
        this.debug && this.renderizarFps(1000 / this.tempoFrame);
        this.debug && this.renderizarLog(renderizacao.logCorpos);
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
    renderizarRestricoes(pathD) {
        this._context.strokeStyle = "yellow";
        this._context.stroke(new Path2D(pathD));
    }
    renderizarMouse(pathD) {
        this._context.fillStyle = "orange";
        this._context.fill(new Path2D(pathD));
    }
    renderizarCorpoSelecionado(pathD) {
        this._context.fillStyle = "#202020";
        this._context.fill(new Path2D(pathD));
    }
    renderizarFps(fps) {
        let fpsText = `frame: ${this.frameId} fps: ${Math.round(fps)}`;
        this._context.font = "18px Consolas";
        let fpsMeasureText = this._context.measureText(fpsText).width;
        this._context.fillStyle = "blue";
        this._context.globalAlpha = 0.5;
        let posicaoX = this.largura - fpsMeasureText - 20;
        let posicaoY = this.altura - 10;
        let largura = fpsMeasureText + 10;
        let altura = 20;
        this._context.fill(new Path2D(`M${posicaoX},${posicaoY},L${posicaoX + largura},${posicaoY}L${posicaoX + largura},${posicaoY - altura}L${posicaoX},${posicaoY - altura}`));
        this._context.globalAlpha = 1;
        this._context.fillStyle = "#FFFFFF";
        this._context.fillText(fpsText, this.largura - fpsMeasureText - 15, this.altura - 15);
    }
    renderizarLog(logs) {
        if (logs && logs.length) {
            this._context.fillStyle = "blue";
            this._context.globalAlpha = 0.5;
            let altura = 15 + (logs.length * 12);
            let largura = 250;
            this._context.fill(new Path2D(`M10,10,L${largura},10L${largura},${altura}L10,${altura}`));
            this._context.globalAlpha = 1;
            altura = 0;
            this._context.font = "11px Consolas";
            this._context.fillStyle = "#FFFFFF";
            for (const log of logs) {
                this._context.fillText(log, 15, 22 + altura);
                altura += 11;
            }
        }
    }
}
//# sourceMappingURL=Renderizador2d.js.map
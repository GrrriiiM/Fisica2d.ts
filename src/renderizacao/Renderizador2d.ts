import { Camera2d } from "./Camera2d";
import { Vetor2d } from "../geometria/Vetor2d";
import { Processador2d } from "../nucleo/processador2d";
import { IProcessador2d } from "./IProcessador2d";
import { Renderizacao2d } from "./renderizacao2d";

export interface IRenderizadorOpcoes {
    elementoQuerySelector?: string,
    largura?: number,
    altura?: number,
    logCorpos?: string[],
    onKeypress?: (self: Renderizador2d) => void,
    debug?: boolean
}

export class Renderizador2d {
    readonly elementoHtml: string = "body";
    readonly largura: number = 500;
    readonly altura: number = 500;
    readonly logCorpos = new Array<string>();
    private frameId = 0;
    private _executando = false;
    get executando() { return this._executando; }
    private tempoFrame = 0;
    private tempoTotal = 0;
    private readonly _context: CanvasRenderingContext2D;
    private readonly camera: Camera2d;
    private requisitarFrame: (callback: FrameRequestCallback) => number;
    readonly onKeypress: (self: Renderizador2d, ev: KeyboardEvent) => void;
    public debug: boolean = false;
    constructor(
        readonly processador: IProcessador2d,
        opcoes?: IRenderizadorOpcoes
    ) {
        const op = opcoes ?? {};
        this.elementoHtml = op.elementoQuerySelector ?? this.elementoHtml;
        this.largura = op.largura ?? this.largura;
        this.altura = op.altura ?? this.altura;
        this.logCorpos = op.logCorpos ?? this.logCorpos;
        this.onKeypress = op.onKeypress;
        this.debug = op.debug ?? false;
        let element = document.querySelector(this.elementoHtml);
        let canvas = document.createElement("canvas");
        this._context = canvas.getContext("2d");
        canvas.height = this.altura;
        canvas.width = this.largura;
        element.appendChild(canvas);
        
        element.addEventListener("keypress", (ev) => this._onKeypress(<KeyboardEvent>ev));
        element.addEventListener("mousemove", (ev) => this._onMousemove(<MouseEvent>ev));

        if (typeof window !== 'undefined') {
            if (window.requestAnimationFrame) this.requisitarFrame = (render) => window.requestAnimationFrame(render)
            else if (window.webkitRequestAnimationFrame) this.requisitarFrame = (render) =>  window.webkitRequestAnimationFrame(render);
        }

        this.camera = new Camera2d(this.largura, this.altura);

        this.executar.bind(this);
    }


    
    adicionarLogCorpo(nome: string) {
        this.logCorpos.push(nome);
    }

    iniciar() {
        this._executando = true;
        this.executar(0);
    }

    executar(tempo: number) {
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

    moverCamera(x: number, y: number) {
        this.camera.mover(x, y);
    }

    private _onKeypress(ev: KeyboardEvent) {
        if (ev.key == "'") 
            if (this._executando) this.parar(); else this.iniciar();

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

    private _onMousemove(ev: MouseEvent) {
        this.processador.atualizarMouse(ev.x, ev.y, ev.buttons==1, ev.buttons==2);
    }

    renderizar(renderizacao: Renderizacao2d) {
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
        this.debug && this.renderizarFps(1000/this.tempoFrame);
        this.debug && this.renderizarLog(renderizacao.logCorpos);
        
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

    renderizarEixoPrincipal(pathD: string) {
        this._context.strokeStyle = "red";
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

    renderizarCentros(pathD: string) {
        this._context.fillStyle = "blue";
        this._context.fill(new Path2D(pathD));
    }

    renderizarDormindos(pathD: string) {
        this._context.fillStyle = "orange";
        this._context.fill(new Path2D(pathD));
    }

    renderizarRestricoes(pathD: string) {
        this._context.strokeStyle = "yellow";
        this._context.stroke(new Path2D(pathD));
    }

    renderizarMouse(pathD: string) {
        this._context.fillStyle = "orange";
        this._context.fill(new Path2D(pathD));
    }

    renderizarCorpoSelecionado(pathD: string) {
        this._context.fillStyle = "#202020";
        this._context.fill(new Path2D(pathD));
    }


    renderizarFps(fps: number) {
        let fpsText = `frame: ${this.frameId} fps: ${Math.round(fps)}`;
        this._context.font = "18px Consolas";
        let fpsMeasureText = this._context.measureText(fpsText).width;

        this._context.fillStyle = "blue";
        this._context.globalAlpha = 0.5;
        let posicaoX = this.largura - fpsMeasureText - 20;
        let posicaoY = this.altura - 10
        let largura = fpsMeasureText + 10;
        let altura = 20;
        this._context.fill(new Path2D(`M${posicaoX},${posicaoY},L${posicaoX + largura},${posicaoY}L${posicaoX + largura},${posicaoY - altura}L${posicaoX},${posicaoY - altura}`));
        this._context.globalAlpha = 1;
        
        this._context.fillStyle = "#FFFFFF";
        this._context.fillText(fpsText, this.largura - fpsMeasureText - 15,this.altura - 15);
    }

    renderizarLog(logs: string[]) {
        if (logs && logs.length) {
            this._context.fillStyle = "blue";
            this._context.globalAlpha = 0.5;
            let altura = 15+(logs.length*12);
            let largura = 250;
            this._context.fill(new Path2D(`M10,10,L${largura},10L${largura},${altura}L10,${altura}`));
            this._context.globalAlpha = 1;
            altura = 0;
            this._context.font = "11px Consolas";
            this._context.fillStyle = "#FFFFFF";

            for(const log of logs) {
                this._context.fillText(log, 15, 22 + altura);
                altura+=11;
            }
        }
    }
}

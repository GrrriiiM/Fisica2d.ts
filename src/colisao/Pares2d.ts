import { Forma2d } from "../geometria/Forma2d";
import { Corpo2d } from "../objetos/Corpo2d";
import { Contato2d } from "./Contato2d";
import { Sat2d } from "./Sat2d";
import { Colisao2d } from "./Colisao2d";

export class Par2d {
    readonly id: string;
    readonly corpoA: Corpo2d;
    readonly corpoB: Corpo2d;
    readonly massaInvertida: number;
    readonly friccao: number;
    readonly friccaoEstatica: number;
    readonly restituicao: number;
    readonly despejo: number;
    readonly contatos = new Array<Contato2d>();
    readonly separacao = 0;
    private colisao: Colisao2d;
    colidiu: boolean = false;

    constructor(
        readonly formaA: Forma2d,
        readonly formaB: Forma2d
    ) {
        this.id = Par2d.CriarId(formaA, formaB);
        this.corpoA = this.formaA.corpo;
        this.corpoB = this.formaB.corpo;
        this.massaInvertida = this.corpoA.massaInvertida + this.corpoB.massaInvertida;
        this.friccao = Math.min(this.corpoA.friccao, this.corpoB.friccao);
        this.friccaoEstatica = Math.max(this.corpoA.friccaoEstatica, this.corpoB.friccaoEstatica);
        this.restituicao = Math.max(this.corpoA.restituicao, this.corpoB.restituicao);
        this.despejo = Math.max(this.corpoA.despejo, this.corpoB.despejo);
    }

    static CriarId(formaA: Forma2d, formaB: Forma2d) {
        return `${formaA.id}_${formaB.id}`;
    }

    detectarColisao() {
        this.contatos.splice(0, this.contatos.length);
        this.colidiu = false;
        this.colisao = Sat2d.detectar(this.formaA, this.formaB, this.colisao);
        if (this.colisao && this.colisao.contatos.length) {
            this.colisao.contatos.forEach(_ => this.contatos.push(_));
            this.colidiu = true;
        }
    }


}
import { Mundo2d } from "../../src/objetos/Mundo2d";
import { Vetor2d } from "../../src/geometria/Vetor2d";
import { Motor2d } from "../../src/nucleo/Motor2d";
import { Processador2d } from "../../src/nucleo/Processador2d";
import { Renderizador2d } from "../../src/renderizacao/Renderizador2d";
import { Construtor2d } from "../../src/geometria/Construtor2d";
import { Eventos2d } from "../../src/nucleo/Eventos2d";

const mundo = new Mundo2d(1000, 600, { gravidade: new Vetor2d(0, 0.1), paredes: [true] });
const eventos = new Eventos2d();
const motor = new Motor2d(mundo, eventos);
const processador = new Processador2d(motor);
const canvas = new Renderizador2d(processador, { largura: mundo.largura, altura: mundo.altura, logCorpos: ["bola"] });

canvas.moverCamera(0, 0);

const tamanhoCaixa = 20;
for(let i=0;i<4;i++) {
    for(let j=0;j<25;j++) {
        mundo.adicionarCorpo(Construtor2d.Corpo(400+(tamanhoCaixa*i), ((575-(tamanhoCaixa/2)) - (tamanhoCaixa*j)), [Construtor2d.Quadrado(tamanhoCaixa)], { dormindo: true, nome: "caixa" }));
    }
}

mundo.adicionarCorpo(Construtor2d.Corpo(900, 100, [Construtor2d.Circulo(60)], { densidade: 0.1, nome: "bola" }));

mundo.adicionarCorpo(Construtor2d.Corpo(875, 408, [Construtor2d.TrianguloReto(300, 500, true)], { estatico: true }));
mundo.adicionarCorpo(Construtor2d.Corpo(808, 475, [Construtor2d.TrianguloReto(500, 300, true)], { estatico: true }));

let caixasAtivas = false;
eventos.onColisaoIniciada = (m, c) => {
    if (!caixasAtivas) {
        for(const colisao of c) {
            if (colisao.corpoA.nome == "bola" || colisao.corpoB.nome == "bola") {
                if (colisao.corpoA.nome == "caixa" || colisao.corpoB.nome == "caixa") {
                    for(const corpo of m.corpos.filter(_ => _.nome == "caixa")) {
                        corpo.setDormindo(false);
                    }
                    caixasAtivas = true;
                }
            }
        }
    }
}

canvas.iniciar();






//mundo.adicionarCorpo(Construtor2d.Retangulo(50, 350, 260, 50, { estatico: true}));
// mundo.adicionarCorpo(Construtor2d.Retangulo(120, 430, 260, 50, { estatico: true}));


import { Mundo2d } from "../objetos/Mundo2d";
import { Vetor2d } from "../geometria/Vetor2d";
import { Motor2d } from "../nucleo/Motor2d";
import { Processador2d } from "../nucleo/Processador2d";
import { Canvas2d } from "../renderizacao/Renderizador2d";
import { Construtor2d } from "../geometria/Construtor2d";

const mundo = new Mundo2d(800, 600, {gravidade: new Vetor2d(0, 1), paredes: [true]});
const motor = new Motor2d(mundo);
const processador = new Processador2d(motor);
const canvas = new Canvas2d(processador, { largura: mundo.largura, altura: mundo.altura });


for(let i=0;i<1;i++) {
    for(let j=0;j<9;j++) {
        mundo.adicionarCorpo(Construtor2d.Quadrado(100+(50*i), 550 - (50*j), 50, {angulo: 0*(Math.PI/180) }));
    }
}




//mundo.adicionarCorpo(Construtor2d.Quadrado(250, 250, 10));

//mundo.adicionarCorpo(Construtor2d.Retangulo(50, 350, 260, 50, { estatico: true}));
// mundo.adicionarCorpo(Construtor2d.Retangulo(120, 430, 260, 50, { estatico: true}));

canvas.moverCamera(0, 0);

canvas.iniciar();
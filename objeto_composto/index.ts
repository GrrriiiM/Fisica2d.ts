import { Mundo2d } from "../../src/objetos/Mundo2d";
import { Vetor2d } from "../../src/geometria/Vetor2d";
import { Motor2d } from "../../src/nucleo/Motor2d";
import { Processador2d } from "../../src/nucleo/Processador2d";
import { Canvas2d } from "../../src/renderizacao/Renderizador2d";
import { Construtor2d } from "../../src/geometria/Construtor2d";
import { Eventos2d } from "../../src/nucleo/Eventos2d";
import { Forma2d } from "../../src/geometria/Forma2d";
import { Corpo2d } from "../../src/objetos/Corpo2d";

const mundo = new Mundo2d(1000, 600, { gravidade: new Vetor2d(0, 0.1), paredes: [true] });
const eventos = new Eventos2d();
const motor = new Motor2d(mundo, eventos);
const processador = new Processador2d(motor);
const canvas = new Canvas2d(processador, { largura: mundo.largura, altura: mundo.altura, logCorpos: ["cruz"] });

let forma1 = Construtor2d.Retangulo(225, 225, 200, 50).formas[0];
let forma2 = Construtor2d.Retangulo(175, 175, 50, 200).formas[0];

let corpo1 = new Corpo2d(new Vetor2d(180,180), [forma1, forma2], {angulo: 0*(Math.PI/180)});

let forma3 = Construtor2d.Retangulo(300, 100, 100, 25).formas[0];
let forma4 = Construtor2d.Retangulo(300, 100, 25, 100).formas[0];

let corpo2 = new Corpo2d(new Vetor2d(300,100), [forma3, forma4]);


mundo.adicionarCorpo(corpo1);
mundo.adicionarCorpo(corpo2);

canvas.iniciar();






//mundo.adicionarCorpo(Construtor2d.Retangulo(50, 350, 260, 50, { estatico: true}));
// mundo.adicionarCorpo(Construtor2d.Retangulo(120, 430, 260, 50, { estatico: true}));


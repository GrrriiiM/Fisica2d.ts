import { Mundo2d } from "../objetos/Mundo2d";
import { Vetor2d } from "../geometria/Vetor2d";
import { Motor2d } from "../nucleo/Motor2d";
import { Processador2d } from "../nucleo/Processador2d";
import { Canvas2d } from "../renderizacao/Renderizador2d";
import { Construtor2d } from "../geometria/Construtor2d";

const mundo = new Mundo2d(800, 600, {gravidade: new Vetor2d(0, 10), paredes: [true]});
const motor = new Motor2d(mundo);
const processador = new Processador2d(motor);
const canvas = new Canvas2d(processador, { largura: mundo.largura, altura: mundo.altura });

mundo.adicionarCorpo(Construtor2d.Quadrado(200, 200, 50));

mundo.adicionarCorpo(Construtor2d.Quadrado(250, 250, 10));

mundo.adicionarCorpo(Construtor2d.Retangulo(50, 300, 500, 50, { estatico: true}));

canvas.moverCamera(0, 0);

canvas.iniciar();
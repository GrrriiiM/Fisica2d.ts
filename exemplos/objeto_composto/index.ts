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
const renderizador = new Renderizador2d(processador, { largura: mundo.largura, altura: mundo.altura, logCorpos: ["cruz"] });

let forma1 = Construtor2d.Retangulo(200, 50, {x: 37.5, y: 37.5});
let forma2 = Construtor2d.Retangulo(50, 200, {x: -37., y: -37.5});

let corpo1 = Construtor2d.Corpo(200, 200, [forma1, forma2], {angulo: -0*(Math.PI/180), estatico: false});

let forma3 = Construtor2d.Retangulo(100, 25);
let forma4 = Construtor2d.Retangulo(25, 100);

let corpo2 = Construtor2d.Corpo(350,400, [forma3, forma4]);

renderizador.adicionarLogCorpo(corpo1.nome);
renderizador.adicionarLogCorpo(corpo2.nome);


mundo.adicionarCorpo(corpo1);
mundo.adicionarCorpo(corpo2);


renderizador.iniciar();






//mundo.adicionarCorpo(Construtor2d.Retangulo(50, 350, 260, 50, { estatico: true}));
// mundo.adicionarCorpo(Construtor2d.Retangulo(120, 430, 260, 50, { estatico: true}));


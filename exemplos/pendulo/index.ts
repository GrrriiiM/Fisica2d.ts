import { Mundo2d } from "../../src/objetos/Mundo2d";
import { Vetor2d } from "../../src/geometria/Vetor2d";
import { Motor2d } from "../../src/nucleo/Motor2d";
import { Processador2d } from "../../src/nucleo/Processador2d";
import { Renderizador2d } from "../../src/renderizacao/Renderizador2d";
import { Construtor2d } from "../../src/geometria/Construtor2d";
import { Eventos2d } from "../../src/nucleo/Eventos2d";
import { Restricao2d } from "../../src/objetos/Restricao2d";
import { Contato2d } from "../../src/colisao/Contato2d";

const mundo = new Mundo2d(1000, 600, { gravidade: new Vetor2d(0, 0.1), paredes: [true] });
const eventos = new Eventos2d();
const motor = new Motor2d(mundo, eventos);
const processador = new Processador2d(motor);
const renderizador = new Renderizador2d(processador, { largura: mundo.largura, altura: mundo.altura});


let corpo1 = mundo.adicionarCorpo(300, 300, [Construtor2d.Circulo(30)], { densidade: 10, friccao: 0, fricicaoAr: 0.0001, restituicao: 1, despejo: 1, inercia: Number.POSITIVE_INFINITY });
mundo.adicionarRestricao({ corpoA: corpo1, pontoA: new Vetor2d(0, 0), pontoB: new Vetor2d(300, 100), tamanho: 200, rigidez: 1, rigidezAngular: 1, amortecimento: 0});
let corpo2 = mundo.adicionarCorpo(359, 300, [Construtor2d.Circulo(30)], { densidade: 10, friccao: 0, fricicaoAr: 0.0001, restituicao: 1, despejo: 1, inercia: Number.POSITIVE_INFINITY });
mundo.adicionarRestricao({ corpoA: corpo2, pontoA: new Vetor2d(0, 0), pontoB: new Vetor2d(359, 100), tamanho: 200, rigidez: 1, rigidezAngular: 1, amortecimento: 0});
let corpo3 = mundo.adicionarCorpo(418, 300, [Construtor2d.Circulo(30)], { densidade: 10, friccao: 0, fricicaoAr: 0.0001, restituicao: 1, despejo: 1, inercia: Number.POSITIVE_INFINITY });
mundo.adicionarRestricao({ corpoA: corpo3, pontoA: new Vetor2d(0, 0), pontoB: new Vetor2d(418, 100), tamanho: 200, rigidez: 1, rigidezAngular: 1, amortecimento: 0});
let corpo4 = mundo.adicionarCorpo(477, 300, [Construtor2d.Circulo(30)], { densidade: 10, friccao: 0, fricicaoAr: 0.0001, restituicao: 1, despejo: 1, inercia: Number.POSITIVE_INFINITY });
mundo.adicionarRestricao({ corpoA: corpo4, pontoA: new Vetor2d(0, 0), pontoB: new Vetor2d(477, 100), tamanho: 200, rigidez: 1, rigidezAngular: 1, amortecimento: 0});
let corpo5 = mundo.adicionarCorpo(536, 300, [Construtor2d.Circulo(30)], { densidade: 10, friccao: 0, fricicaoAr: 0.0001, restituicao: 1, despejo: 1, inercia: Number.POSITIVE_INFINITY });
mundo.adicionarRestricao({ corpoA: corpo5, pontoA: new Vetor2d(0, 0), pontoB: new Vetor2d(536, 100), tamanho: 200, rigidez: 1, rigidezAngular: 1, amortecimento: 0});


renderizador.adicionarLogCorpo(corpo1.nome);

eventos.onColisaoIniciada = (mundo, colisoes) => {
    for(const corpo of mundo.corpos) {
        corpo.setDormindo(false);
    }
};

renderizador.iniciar();
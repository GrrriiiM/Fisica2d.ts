import { Mundo2d } from "../../src/objetos/Mundo2d";
import { Vetor2d } from "../../src/geometria/Vetor2d";
import { Motor2d } from "../../src/nucleo/Motor2d";
import { Processador2d } from "../../src/nucleo/Processador2d";
import { Renderizador2d } from "../../src/renderizacao/Renderizador2d";
import { Construtor2d } from "../../src/geometria/Construtor2d";
import { Eventos2d } from "../../src/nucleo/Eventos2d";
import { Restricao2d } from "../../src/objetos/Restricao2d";

const mundo = new Mundo2d(1000, 600, { gravidade: new Vetor2d(0, 0.1), paredes: [true] });
const eventos = new Eventos2d();
const motor = new Motor2d(mundo, eventos);
const processador = new Processador2d(motor);
const renderizador = new Renderizador2d(processador, { largura: mundo.largura, altura: mundo.altura });

const corpo1 = Construtor2d.Corpo(500, 440, [Construtor2d.Circulo(40)], { nome:"bola", restituicao: 1, densidade: 5, despejo: 0 });
const corpo2 = Construtor2d.Corpo(600, 425, [Construtor2d.Retangulo(100, 300)]);

const restricao1 = new Restricao2d({ corpoA: corpo1, pontoA: new Vetor2d(0, -40), pontoB: new Vetor2d(500, 100), tamanho: 300, amortecimento: 0, rigidezAngular: 0, rigidez: 1 })

mundo.adicionarCorpo(corpo1);
// mundo.adicionarCorpo(corpo2);
mundo.adicionarRestricao(restricao1);

renderizador.adicionarLogCorpo(corpo1.nome);


const tamanhoCaixa = 15;
for(let i=0;i<8;i++) {
    for(let j=0;j<37;j++) {
        mundo.adicionarCorpo(Construtor2d.Corpo(600+(tamanhoCaixa*i), ((575-(tamanhoCaixa/2)) - (tamanhoCaixa*j)), [Construtor2d.Quadrado(tamanhoCaixa)], { dormindo: true, nome: "caixa", restituicao: 0, despejo: 0.5 }));
    }
}

// let caixasAtivas = false;
// eventos.onColisaoIniciada = (m, c) => {
//     if (!caixasAtivas) {
//         for(const colisao of c) {
//             if (colisao.corpoA.nome == "bola" || colisao.corpoB.nome == "bola") {
//                 if (colisao.corpoA.nome == "caixa" || colisao.corpoB.nome == "caixa") {
//                     for(const corpo of m.corpos.filter(_ => _.nome == "caixa")) {
//                         corpo.setDormindo(false);
//                     }
//                     caixasAtivas = true;
//                 }
//             }
//         }
//     }
// }

renderizador.iniciar();






//mundo.adicionarCorpo(Construtor2d.Retangulo(50, 350, 260, 50, { estatico: true}));
// mundo.adicionarCorpo(Construtor2d.Retangulo(120, 430, 260, 50, { estatico: true}));


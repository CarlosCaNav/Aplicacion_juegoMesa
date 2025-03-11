import { Injectable } from '@angular/core';
import { Mapa } from '../interfaz.mapa';

@Injectable({
  providedIn: 'root',
})
export class DatosService {
  enemigosIniciales: number = 15; // probabilidad sobre 100 de que haya un enemigo por cada loseta
  pistasIniciales: number = 8;
  numeroDeObjetos: number = 15; //numero de objetos en cada casa

  //dificultad
  //he añadido que cuando el mazo de enemigos simples se acabe, se vuelva a barajar añadiendo un enemigo más
  mazoEnemigosSimples: number = 10; // a partir de qué ronda aparece un segundo enemigo en cada ronda. Hasta entonces, la probabilidad de que aparezca es progresiva.
  rondaPrimeraFase: number = 1;
  rondaSegundaFase: number = 8;
  rondaTerceraFase: number = 18;
  rondaCuartaFase: number = 25;
  probabilidadAvanceDoble: number = 8; //sobre 100
  probabilidadAtaquePrimigenio: number = 30;

  numeroLosetas: number = 63;
  ronda: number = 0;
  fase: number = 0; //las diferentes fases del juego
  pistasEncontradas: number = 0;
  armaEncontrada: string = '';
  casillaPrimigenio: number = 0;
  rutaImagen: string = '';
  editar: boolean = true;
  editarRutas: boolean = false;
  nombreMapaActual: string = 'Prueba';
  casillasConSalidaEnemigos: number[] = [];
  casasDespejadas: string[] = [];
  recursosCasas: Array<string>[] = [];
  idenficadorCasas: string[] = []; //esto es una chapuza... sirve para saber qué array va con qué casa. Lo suyo sería usar mapas o records
  enemigoAvanceAdicional: string = ''; //nombre del enemigo que tiene un turno adicional
  clavesLocalStorage: string[] = [];

  emergenteMostrado: string = '';
  animacionCarga: boolean = false;

  public mapaActual: Mapa[] = [
    {
      id: 1, // numero de la loseta
      calleH: 1, // numero de la calle horizontal impar
      calleV: 2, // numero de la calle vertical par
      casa: '', // nombre de la casa en letra
      carretera: true, // loseta de carretera o casa
      enemigos: [], // si hay enemigo en la loseta y su nombre
      rutasEnemigos: [],
      visible: false, // si la loseta esta visible
      pista: false, // si hay pista en la loseta
      puertaSup: false,
      puertaInf: false,
      puertaDer: false,
      puertaIzq: false,
    },
  ];

  //No es necesario que la suma de las probabilidades de 100, pero sí es más fácil de visualizarlo así
  armasMunicion: { arma: string; probabilidad: number }[] = [
    { arma: 'Palanca', probabilidad: 10 },
    { arma: 'Hacha', probabilidad: 8 }, //23%
    { arma: 'Espada', probabilidad: 5 },

    { arma: 'Pistola', probabilidad: 9 },
    { arma: 'Escopeta', probabilidad: 7 }, //21%
    { arma: 'Rifle', probabilidad: 5 },

    { arma: 'Munición Pistola', probabilidad: 20 },
    { arma: 'Munición Escopeta', probabilidad: 16 }, //48%
    { arma: 'Munición Rifle', probabilidad: 12 },

    { arma: 'Botiquin', probabilidad: 2 },
    { arma: 'Adrenalina', probabilidad: 4 }, //8%
    { arma: 'Molotov', probabilidad: 2 },
  ];

  //colocar los ID en orden
  enemigos: {
    id: number;
    enemigo: string;
    rutas: Array<number>[];
    fase: number;
    avance: number;
    vida: number;
    probabilidad: number;
  }[] = [
    {
      id: 0,
      enemigo: 'Reptador',
      rutas: [],
      fase: 0,
      avance: 1,
      vida: 2,
      probabilidad: 8,
    },
    {
      id: 1,
      enemigo: 'Caminante',
      rutas: [],
      fase: 1,
      avance: 2,
      vida: 2,
      probabilidad: 5,
    },
    {
      id: 2,
      enemigo: 'Escupidor',
      rutas: [],
      fase: 1,
      avance: 1,
      vida: 2,
      probabilidad: 4,
    },
    {
      id: 3,
      enemigo: 'Gordo',
      rutas: [],
      fase: 2,
      avance: 1,
      vida: 5,
      probabilidad: 5,
    },
  ];

  imagenes: { [key: string]: string } = {
    'Palanca': './busqueda/Palanca.jpg',
    'Hacha': './busqueda/Hacha.jpg',
    'Espada': './busqueda/Espada.jpg',
    Pistola: './busqueda/Pistola.jpg',
    Escopeta: './busqueda/Escopeta.jpg',
    Rifle: './busqueda/Rifle.jpg',
    'Munición Pistola': './busqueda/MPistola.jpg',
    'Munición Escopeta': './busqueda/MEscopeta.jpg',
    'Munición Rifle': './busqueda/MRifle.jpg',
    Botiquin: './busqueda/Botiquin.jpg',
    Adrenalina: './busqueda/Adrenalina.jpg',
    Molotov: './busqueda/Molotov.jpg',
  };

  actualizarImagen() {
    this.rutaImagen =
      this.imagenes[this.armaEncontrada] || 'assets/images/default.jpg';
  }
  pistas(operacion: string) {
    if (operacion === 'sumar') {
      this.pistasEncontradas++;
    } else {
      this.pistasEncontradas--;
    }
    if (
      this.pistasEncontradas === 2 &&
      this.fase === 3 &&
      this.mapaActual[this.casillaPrimigenio].visible === false
    ) {
      this.mapaActual[this.casillaPrimigenio].visible = true;
    }
    if (this.pistasEncontradas >= 3) {
      alert('El primigenio pierde 5 puntos de vida.');
    }
  }

  emergente(emergente: string) {
    this.emergenteMostrado = emergente;
  }
}

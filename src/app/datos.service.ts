import { Injectable } from '@angular/core';
import { Mapa } from './interfaz.mapa';

@Injectable({
  providedIn: 'root',
})
export class DatosService {
  enemigosIniciales: number = 10;
  pistasIniciales: number = 10;
  numeroDeObjetos: number = 20; //numero de objetos en cada casa
  numeroLosetas: number = 63;
  
  ronda: number = 0;
  fase: number = 0; //las diferentes fases para ir subiendo de dificultad
  armaEncontrada: string = '';
  editar: boolean = true;
  editarRutas: boolean = false;
  nombreMapaActual: string = 'Prueba';
  casillasConSalidaEnemigos: number[]=[];
  casasDespejadas: string[] = [];
  recursosCasas: Array<string>[]=[];
  idenficadorCasas: string[]=[]; //esto es una chapuza... sirve para saber qué array va con qué casa. Lo suyo sería usar mapas o records
  clavesLocalStorage: string[] = [];

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

  armasMunicion: { arma: string; probabilidad: number }[] = [
    { arma: 'Palanca', probabilidad: 6 },
    { arma: 'Hacha', probabilidad: 5 },
    { arma: 'Espada', probabilidad: 5 },
    { arma: 'Katana', probabilidad: 4 },
    { arma: 'Pistola', probabilidad: 6 },
    { arma: 'Escopeta', probabilidad: 5 },
    { arma: 'Rifle', probabilidad: 5 },
    { arma: 'Munición Pistola', probabilidad: 8 },
    { arma: 'Munición Escopeta', probabilidad: 7 },
    { arma: 'Munición Rifle', probabilidad: 5 },
    { arma: 'Botiquin', probabilidad: 1 },
    { arma: 'Adrenalina', probabilidad: 3 },
    { arma: 'Mechero', probabilidad: 1 },
    { arma: 'Gasolina', probabilidad: 2 },
  ];

  Enemigos: { enemigo: string; rutas: Array<number>[];fase: number; probabilidad: number; avance: number; vida: number}[] = [
    { enemigo: 'reptador', rutas: [], fase: 0, probabilidad: 1, avance: 1, vida: 2},
    { enemigo: 'caminante', rutas: [], fase: 1, probabilidad: 4, avance: 2, vida: 2},
    { enemigo: 'Gordo', rutas: [], fase: 1, probabilidad: 2, avance: 1, vida: 5},
    { enemigo: 'Primigenio', rutas: [], fase: 3, probabilidad: 0, avance: 1, vida: 2},
  ];
}

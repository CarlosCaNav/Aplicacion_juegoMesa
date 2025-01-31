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

  armaEncontrada: string = '';
  editar: boolean = true;
  nombreMapaActual: string = 'Prueba';
  casasDespejadas: string[] = [];
  recursosCasas: Array<string>[]=[];
  idenficadorCasas: string[]=[]; //esto es una chapuza...

  public mapaActual: Mapa[] = [
    {
      id: 1, // numero de la loseta
      calleH: 1, // numero de la calle horizontal impar
      calleV: 2, // numero de la calle vertical par
      casa: '', // nombre de la casa en letra
      carretera: true, // loseta de carretera o casa
      enemigo: 'Ninguno', // si hay enemigo en la loseta y su nombre
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
  ];
}

import { Injectable } from '@angular/core';
import { Mapa } from './interfaz.mapa';

@Injectable({
  providedIn: 'root',
})
export class DatosService {

enemigosIniciales: number = 10;
pistasIniciales: number = 10;

  numeroLosetas: number = 63;
  editar: boolean = true;
  nombreMapaActual: string = 'Prueba';
  casasDespejadas: string[]=[];

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

}

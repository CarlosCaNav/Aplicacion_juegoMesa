import { Injectable } from '@angular/core';
import { Mapa } from './interfaz.mapa';

@Injectable({
  providedIn: 'root',
})
export class DatosService {

  numeroLosetas: number = 63;

  public mapaActual: Mapa[] = [
    {
      id: 1, // numero de la loseta
      calleH: 1, // numero de la calle horizontal impar
      calleV: 2, // numero de la calle vertical par
      casa: 'A', // nombre de la casa en letra mayuscula
      carretera: true, // loseta de carretera o casa
      enemigo: 'Ninguno', // si hay enemigo en la loseta y su nombre
      visible: false, // si la loseta esta visible
      pista: false, // si hay pista en la loseta
    },
  ];
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectsService {

  constructor() { }


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
}

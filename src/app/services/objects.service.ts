import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectsService {

  constructor() { }


  //No es necesario que la suma de las probabilidades de 100, pero sí es más fácil de visualizarlo así
  armasMunicion: { object: string; probability: number }[] = [
    { object: 'Palanca', probability: 10 },
    { object: 'Hacha', probability: 8 }, //23%
    { object: 'Espada', probability: 5 },

    { object: 'Pistola', probability: 9 },
    { object: 'Escopeta', probability: 7 }, //21%
    { object: 'Rifle', probability: 5 },

    { object: 'Munición Pistola', probability: 20 },
    { object: 'Munición Escopeta', probability: 16 }, //48%
    { object: 'Munición Rifle', probability: 12 },

    { object: 'Botiquin', probability: 2 },
    { object: 'Adrenalina', probability: 4 }, //8%
    { object: 'Molotov', probability: 2 },
  ];

  randomObject() {
    let totalProbability = 0;
    for (let i = 0; i < this.armasMunicion.length; i++) {
      totalProbability += this.armasMunicion[i].probability;
    }

    let randomProbability = Math.floor(Math.random() * totalProbability);
    let chosenObject = null;
    let cumulativeProbability = 0;
    for (let i = 0; i < this.armasMunicion.length; i++) {
      cumulativeProbability += this.armasMunicion[i].probability;
      if (randomProbability < cumulativeProbability) {
        chosenObject = this.armasMunicion[i];
        break;
      }
    }
    if (chosenObject === null) {
      chosenObject = this.armasMunicion[0];
    }
    return chosenObject.object;
  }

}

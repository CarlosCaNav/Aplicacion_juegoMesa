import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectsService {

  constructor() { }


  //No es necesario que la suma de las probabilidades de 100, pero sí es más fácil de visualizarlo así
  objects: { object: string; probability: number }[] = [
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
    for (let i = 0; i < this.objects.length; i++) {
      totalProbability += this.objects[i].probability;
    }

    let randomProbability = Math.floor(Math.random() * totalProbability);
    let chosenObject = null;
    let cumulativeProbability = 0;
    for (let i = 0; i < this.objects.length; i++) {
      cumulativeProbability += this.objects[i].probability;
      if (randomProbability < cumulativeProbability) {
        chosenObject = this.objects[i];
        break;
      }
    }
    if (chosenObject === null) {
      alert("Aquí algo falla! Número aleatorio es" + randomProbability )
      chosenObject = this.objects[0];
    }
    return chosenObject.object;
  }

}

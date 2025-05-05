import { Injectable, inject } from '@angular/core';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class EnemiesService {
  constructor() {}

  private mapService: MapService = inject(MapService);

  private entryOfEnemies: number[][] = [];

  createEntries() {
    this.entryOfEnemies = [];
    for (let i = 0; i < this.mapService.tiles.length; i++) {
      for (let j = 0; j < this.mapService.tiles[i].length; j++) {
        if (this.mapService.tiles[i][j].house != true) {
          if (
            (i === 0) ||
            (j === this.mapService.tiles[i].length - 1) ||
            (i === this.mapService.tiles.length - 1) ||
            (j === 0)
          ) {
            this.entryOfEnemies.push([i, j]);
            
          }
        }
      }
    }
  }

  createEnemy() {
    this.createEntries();
    
    console.log("hay estas entradas", this.entryOfEnemies.length);
    
    let randomEntry = Math.floor(Math.random() * this.entryOfEnemies.length);
    console.log("el resultado es ",randomEntry);
    
    let idR = this.entryOfEnemies[randomEntry][0];
    let idC = this.entryOfEnemies[randomEntry][1];

    console.log("j =", this.entryOfEnemies[randomEntry][0]);
    console.log("i =", this.entryOfEnemies[randomEntry][1]);
    
    this.mapService.createEnemy(idR, idC);

    

  }

  enemyAdvance(idR: number, idC: number) {
    let condition = false;
    let routes: number[][] = [];

    routes.push([idR, idC]);

    while (condition) {
      let newRoute: boolean = false;
      for (let i = 0; i < routes.length; i++) {
        if (
          idR >= 1 &&
          this.mapService.tiles[routes[i][0] - 1][routes[i][1]].house != true
        ) {
          if (newRoute!) {
            routes[i] = routes[(routes[i][0] - 1, routes[i][1])];

            newRoute == true;
          } else {
            routes.push([routes[i][0] - 1, routes[i][1]]);
          }
        }
      }
    }
  }
}

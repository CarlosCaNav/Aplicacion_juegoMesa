import { Injectable, inject } from '@angular/core';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class EnemiesService {
  constructor() {}

  private mapService: MapService = inject(MapService);

  private entryOfEnemies: number[][] = [];

 map = this.mapService.getTiles();

  createEntries() {
    this.entryOfEnemies = [];
    for (let i = 0; i < this.mapService.tiles.length; i++) {
      for (let j = 0; j < this.mapService.tiles[i].length; j++) {
        if (this.mapService.tiles[i][j].house != true) {
          if (
            i === 0 ||
            j === this.mapService.tiles[i].length - 1 ||
            i === this.mapService.tiles.length - 1 ||
            j === 0
          ) {
            this.entryOfEnemies.push([i, j]);
          }
        }
      }
    }
  }

  createRandomEnemy() {
    this.createEntries();

    let randomEntry = Math.floor(Math.random() * this.entryOfEnemies.length);

    let idR = this.entryOfEnemies[randomEntry][0];
    let idC = this.entryOfEnemies[randomEntry][1];

    console.log('j =', this.entryOfEnemies[randomEntry][0]);
    console.log('i =', this.entryOfEnemies[randomEntry][1]);

    this.mapService.createEnemy(idR, idC);
  }


  enemyAdvance() {

this.map = this.mapService.tiles;
    console.log(this.map);

    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j].house != true && this.map[i][j].visible) {
          this.mapService.enemyRoute(i, j, 1);
        } else {
          this.mapService.enemyRoute(i, j, 0);
        }
      }
    };
    
    let run = true;
    let number: number = 1;
    
while(run){

    run = false;

    for (let i = 0; i < this.map.length; i++) {
console.log("holi  I");

      for (let j = 0; j < this.map[i].length; j++) {
        //si es el número buscado
console.log("holi  J");
        if ((this.map[i][j].enemyRoute === number)) {
          if (i > 0 && this.map[i - 1][j].house === false && this.map[i - 1][j].enemyRoute == 0) {
            this.mapService.enemyRoute(i - 1, j, number + 1);
            run = true;
          }
          if (j > 0 && this.map[i][j - 1].house === false && this.map[i][j - 1].enemyRoute === 0) {
            this.mapService.enemyRoute(i, j - 1, number + 1);
            run = true;
          }
          if (j < this.map[i].length - 1 && this.map[i][j + 1].house === false && this.map[i][j + 1].enemyRoute === 0) {
            this.mapService.enemyRoute(i, j + 1, number + 1);
            run = true;
          }
          if (i < this.map.length - 1 && this.map[i + 1][j].house === false && this.map[i + 1][j].enemyRoute === 0) {
            this.mapService.enemyRoute(i + 1, j, number + 1);
            run = true;
          }
        }
      }
    }
    number++;}
  }
}

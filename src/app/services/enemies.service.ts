import { Injectable, inject } from '@angular/core';
import { MapService } from './map.service';
import { ITiles } from '../interfaces/tiles';
import { routes } from '../app.routes';

@Injectable({
  providedIn: 'root',
})
export class EnemiesService {
  constructor() {}

  private mapService: MapService = inject(MapService);

  private entryOfEnemies: number[][] = [];

  /*  map = this.mapService.getTiles(); */
  map: ITiles[][] = this.mapService.tiles;

  enemyAdvance() {
    let enemiesSteep = [];

    if (this.entryOfEnemies.length == 0) {
      this.createEntries();
    }
    this.createRoutes();

    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j].enemyRoute === 1) {
          this.mapService.eliminateEnemies(i, j);
        }
        if (this.map[i][j].enemies.length > 0) {
          enemiesSteep.push(
            this.followThePath(i, j, (this.map[i][j].enemyRoute as number) - 1)
          );

          this.mapService.eliminateEnemies(i, j);
          /* this.mapService.createEnemy(enemiesSteep[0], enemiesSteep[1]); */
        }
      }
    }
    for (let i = 0; i < enemiesSteep.length; i++) {
      this.mapService.createEnemy(enemiesSteep[i][0], enemiesSteep[i][1]);
    }

    this.createRandomEnemy();
  }

  followThePath(idR: number, idC: number, number: number) {
    let possibleRoutes = [];

    if (idR >= 1 && this.map[idR - 1][idC].enemyRoute == number) {
      possibleRoutes.push([idR - 1, idC]);
    }
    if (
      idR < this.map.length - 1 &&
      this.map[idR + 1][idC].enemyRoute == number
    ) {
      possibleRoutes.push([idR + 1, idC]);
    }
    if (idC >= 1 && this.map[idR][idC - 1].enemyRoute == number) {
      possibleRoutes.push([idR, idC - 1]);
    }
    if (
      idC < this.map[idR].length - 1 &&
      this.map[idR][idC + 1].enemyRoute == number
    ) {
      possibleRoutes.push([idR, idC + 1]);
    }
    if (possibleRoutes.length == 0) {
      window.alert('error en la ruta de los enemigos');
      return [];
    }
    let randomRoute = Math.floor(Math.random() * possibleRoutes.length);

    return possibleRoutes[randomRoute];
  }

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

    this.mapService.createEnemy(idR, idC);
  }

  createRoutes() {
    this.map = this.mapService.tiles;

    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j].house != true && this.map[i][j].visible) {
          this.mapService.enemyRoute(i, j, 1);
        } else {
          this.mapService.enemyRoute(i, j, 0);
        }
      }
    }

    let run = true;
    let number: number = 1;

    while (run) {
      run = false;

      for (let i = 0; i < this.map.length; i++) {
        for (let j = 0; j < this.map[i].length; j++) {
          //si es el número buscado
          if (this.map[i][j].enemyRoute === number) {
            if (
              i > 0 &&
              this.map[i - 1][j].house === false &&
              this.map[i - 1][j].enemyRoute == 0
            ) {
              this.mapService.enemyRoute(i - 1, j, number + 1);
              run = true;
            }
            if (
              j > 0 &&
              this.map[i][j - 1].house === false &&
              this.map[i][j - 1].enemyRoute === 0
            ) {
              this.mapService.enemyRoute(i, j - 1, number + 1);
              run = true;
            }
            if (
              j < this.map[i].length - 1 &&
              this.map[i][j + 1].house === false &&
              this.map[i][j + 1].enemyRoute === 0
            ) {
              this.mapService.enemyRoute(i, j + 1, number + 1);
              run = true;
            }
            if (
              i < this.map.length - 1 &&
              this.map[i + 1][j].house === false &&
              this.map[i + 1][j].enemyRoute === 0
            ) {
              this.mapService.enemyRoute(i + 1, j, number + 1);
              run = true;
            }
          }
        }
      }
      number++;
    }
  }
}

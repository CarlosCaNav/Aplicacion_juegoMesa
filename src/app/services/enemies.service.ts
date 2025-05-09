import { Injectable, inject } from '@angular/core';
import { MapService } from './map.service';
import { ITiles } from '../interfaces/tiles';
import { ConfigurationsService } from './configurations.service';

@Injectable({
  providedIn: 'root',
})
export class EnemiesService {
  constructor() {}

  private mapService: MapService = inject(MapService);
  private configurationsService: ConfigurationsService = inject(
    ConfigurationsService
  );

  private entryOfEnemies: number[][] = [];

  /*  map = this.mapService.getTiles(); */
  map(): ITiles[][] {
    return this.mapService.getTiles();
  }

  enemies: {
    id: number;
    name: string;
    advance: number;
    phase: number;
    probability: number;
  }[] = [
    { id: 0, name: 'crawler', advance: 1, phase: 0, probability: 8 }, //Terráqueo? Quitino? Escoria reptante, minios larvario, crawler, reptante
    { id: 1, name: 'humanoid', advance: 2, phase: 1, probability: 5 }, //noctumbra? infestado común,
    { id: 2, name: 'spitter', advance: 1, phase: 2, probability: 4 }, //salivante, artillero biológico
    { id: 3, name: 'Megalon', advance: 1, phase: 2, probability: 4 }, //megalon(no, existe), plomizo, acorazado terrestre
  ];

  enemyAdvance() {
    let enemyLow = [];
    let enemyMedium = [];
    let enemySplitter = [];
    let enemyHigh = [];

    if (this.entryOfEnemies.length == 0) {
      this.createEntries();
    }
    this.createRoutes();

    for (let i = 0; i < this.map().length; i++) {
      for (let j = 0; j < this.map()[i].length; j++) {
        if (this.map()[i][j].visible) {
          this.mapService.eliminateAllEnemies(i, j);
        }
        if (this.map()[i][j].enemyRoute > 0) {
          //esto lo puse para que si está dentro de una casa, se quede quieto
          if (this.map()[i][j].enemyLow > 0) {
            enemyLow.push(
              this.followThePath(i, j, this.map()[i][j].enemyRoute - 1)
            );
          }
          if (this.map()[i][j].enemyMedium > 0) {
            //aquí debo hacer lo del doble paso. Pero aseguremos que funciona
            enemyMedium.push(
              this.followThePath(i, j, this.map()[i][j].enemyRoute - 1)
            );
          }
          if (this.map()[i][j].enemySplitter > 0) {
            enemySplitter.push(
              this.followThePath(i, j, this.map()[i][j].enemyRoute - 1)
            );
          }
          if (this.map()[i][j].enemyHigh > 0) {
            enemyHigh.push(
              this.followThePath(i, j, this.map()[i][j].enemyRoute - 1)
            );
          }
          this.mapService.eliminateAllEnemies(i, j);
        }

      }
    }

    for (let i = 0; i < enemyLow.length; i++) {
      this.mapService.createEnemy(enemyLow[i][0], enemyLow[i][1], 'enemyLow');
      console.log('se movió un enemigo bajo');
    }
    for (let i = 0; i < enemyMedium.length; i++) {
      this.mapService.createEnemy(
        enemyMedium[i][0],
        enemyMedium[i][1],
        'enemyMedium'
      );
    }
    for (let i = 0; i < enemySplitter.length; i++) {
      this.mapService.createEnemy(
        enemySplitter[i][0],
        enemySplitter[i][1],
        'enemySplitter'
      );
    }
    for (let i = 0; i < enemyHigh.length; i++) {
      this.mapService.createEnemy(
        enemyHigh[i][0],
        enemyHigh[i][1],
        'enemyHigh'
      );
    }

    this.createRandomEnemy();
  }

  followThePath(idR: number, idC: number, number: number) {
    let possibleRoutes = [];

    if (idR >= 1 && this.map()[idR - 1][idC].enemyRoute == number) {
      possibleRoutes.push([idR - 1, idC]);
    }
    if (
      idR < this.map().length - 1 &&
      this.map()[idR + 1][idC].enemyRoute == number
    ) {
      possibleRoutes.push([idR + 1, idC]);
    }
    if (idC >= 1 && this.map()[idR][idC - 1].enemyRoute == number) {
      possibleRoutes.push([idR, idC - 1]);
    }
    if (
      idC < this.map()[idR].length - 1 &&
      this.map()[idR][idC + 1].enemyRoute == number
    ) {
      possibleRoutes.push([idR, idC + 1]);
    }
    if (possibleRoutes.length == 0) {
      alert('error en la ruta de los enemigos');
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

    this.mapService.createEnemy(idR, idC, 'enemyLow'); //Esto también cambiarlo en un futuro
  }

  createRoutes() {
    for (let i = 0; i < this.map().length; i++) {
      for (let j = 0; j < this.map()[i].length; j++) {
        if (this.map()[i][j].house == false && this.map()[i][j].visible) {
          this.mapService.enemyRoute(i, j, 1);
        } else if (
          this.configurationsService.clearRoad == false &&
          this.map()[i][j].visible &&
          this.map()[i][j].house == true &&
          (this.map()[i][j].doorE ||
            this.map()[i][j].doorN ||
            this.map()[i][j].doorS)
        ) {
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

      for (let i = 0; i < this.map().length; i++) {
        for (let j = 0; j < this.map()[i].length; j++) {
          //si es el número buscado
          if (this.map()[i][j].enemyRoute === number) {
            if (
              i > 0 &&
              this.map()[i - 1][j].house === false &&
              this.map()[i - 1][j].enemyRoute == 0
            ) {
              this.mapService.enemyRoute(i - 1, j, number + 1);
              run = true;
            }
            if (
              j > 0 &&
              this.map()[i][j - 1].house === false &&
              this.map()[i][j - 1].enemyRoute === 0
            ) {
              this.mapService.enemyRoute(i, j - 1, number + 1);
              run = true;
            }
            if (
              j < this.map()[i].length - 1 &&
              this.map()[i][j + 1].house === false &&
              this.map()[i][j + 1].enemyRoute === 0
            ) {
              this.mapService.enemyRoute(i, j + 1, number + 1);
              run = true;
            }
            if (
              i < this.map().length - 1 &&
              this.map()[i + 1][j].house === false &&
              this.map()[i + 1][j].enemyRoute === 0
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
  initialEnemies() {
    for (let i = 0; i < this.map().length; i++) {
      for (let j = 0; j < this.map()[i].length; j++) {
        let randomProbability = Math.floor(Math.random() * 100);

        if (
          randomProbability <
          this.configurationsService.initialEnemyProbabilityPerSquare
        ) {
          console.log('peta aquí?');

          this.mapService.createEnemy(i, j, 'enemyLow');
        }
      }
    }
  }
}

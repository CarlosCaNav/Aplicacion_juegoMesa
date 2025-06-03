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
    internalName: string;
    name: string;
    advance: number;
    phase: number;
    probability: number;
    health: number;
  }[] = [
    //Terráqueo? Quitino? Escoria reptante, minios larvario, crawler, reptante
    {
      id: 0,
      internalName: 'enemyLow',
      name: 'crawler',
      advance: 1,
      phase: 0,
      probability: 8,
      health: 2,
    },
    {
      id: 1,
      internalName: 'enemyMedium',
      name: 'humanoid',
      advance: 2,
      phase: 1,
      probability: 5,
      health: 2,
    }, //noctumbra? infestado común,
    {
      id: 2,
      internalName: 'enemySplitter',
      name: 'spitter',
      advance: 1,
      phase: 2,
      probability: 4,
      health: 1,
    }, //salivante, artillero biológico
    {
      id: 3,
      internalName: 'enemyHigh',
      name: 'acorazado',
      advance: 1,
      phase: 3,
      probability: 4,
      health: 5,
    }, //megalon(no, existe), plomizo, acorazado terrestre
    {
      id: 3,
      internalName: 'bossEnemy',
      name: 'Primigenio',
      advance: 1,
      phase: 4,
      probability: 4,
      health: 30,
    },
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
            for (let k = 0; k < this.map()[i][j].enemyLow; k++) {
              enemyLow.push(
                this.followThePath(i, j, this.map()[i][j].enemyRoute - 1)
              );
            }
          }
          if (this.map()[i][j].enemyMedium > 0) {
            // Comentar esto para que se entienda ++++++++++++++++++++++++++++++++++++++++++++++
            for (let k = 0; k < this.map()[i][j].enemyMedium; k++) {
              let enemyMediumSteepOne = [];
              if (this.map()[i][j].enemyRoute >= 1) {
                enemyMediumSteepOne = this.followThePath(
                  i,
                  j,
                  this.map()[i][j].enemyRoute - 1
                );

                enemyMedium.push(
                  this.followThePath(
                    enemyMediumSteepOne[0],
                    enemyMediumSteepOne[1],
                    this.map()[enemyMediumSteepOne[0]][enemyMediumSteepOne[1]]
                      .enemyRoute - 1
                  )
                );
              } else {
                enemyMedium.push(
                  this.followThePath(i, j, this.map()[i][j].enemyRoute - 1)
                );
              }
            }
          }
          if (this.map()[i][j].enemySplitter > 0) {
            for (let k = 0; k < this.map()[i][j].enemySplitter; k++) {
              enemySplitter.push(
                this.followThePath(i, j, this.map()[i][j].enemyRoute - 1)
              );
            }
          }
          if (this.map()[i][j].enemyHigh > 0) {
            for (let k = 0; k < this.map()[i][j].enemyHigh; k++) {
              enemyHigh.push(
                this.followThePath(i, j, this.map()[i][j].enemyRoute - 1)
              );
            }
          }
          this.mapService.eliminateAllEnemies(i, j);
        }
      }
    }

    for (let i = 0; i < enemyLow.length; i++) {
      this.mapService.createEnemy(enemyLow[i][0], enemyLow[i][1], 'enemyLow');
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
      alert(
        'error en la ruta de los enemigos: idR' +
          idR +
          ' idC' +
          idC +
          '  distancia' +
          number
      );

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



    let totalProbability = 0;
    let phaseEnemies = [];
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].phase <= this.configurationsService.currentPhase) {
        phaseEnemies.push(this.enemies[i]);
        totalProbability += this.enemies[i].probability;
      }
    }

    let randomEnemyProbability = Math.floor(Math.random() * totalProbability);
    let chosenEnemy = null;
    let cumulativeProbability = 0;
    for (let i = 0; i < phaseEnemies.length; i++) {
      cumulativeProbability += phaseEnemies[i].probability;
      if (randomEnemyProbability < cumulativeProbability) {
        chosenEnemy = phaseEnemies[i];
        break;
      }
    }
    if (chosenEnemy === null) {
      chosenEnemy = phaseEnemies[0];
    }


    let idR = this.entryOfEnemies[randomEntry][0];
    let idC = this.entryOfEnemies[randomEntry][1];

    this.mapService.createEnemy(idR, idC, chosenEnemy.internalName); 

    console.log(chosenEnemy.internalName);
    console.log("fase actual", this.configurationsService.currentPhase);
    
    
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
          this.mapService.createEnemy(i, j, 'enemyLow');
        }
      }
    }
  }
}

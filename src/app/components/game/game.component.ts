import { MapService } from '../../services/map.service';
import { NgStyle, NgIf } from '@angular/common';
import { LoadMapService } from '../../services/load-map.service';
import { EnemiesService } from '../../services/enemies.service';
import { ConfigurationsService } from '../../services/configurations.service';
import { Component, OnInit, inject } from '@angular/core';
import { ITiles } from '../../interfaces/tiles';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgStyle, NgIf],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  constructor() {
    
    
  }

  private mapService: MapService = inject(MapService);
  private loadMapService: LoadMapService = inject(LoadMapService);
  private enemiesService: EnemiesService = inject(EnemiesService);
  private configurationsService: ConfigurationsService = inject(
    ConfigurationsService
  );


 map(): ITiles[][] {
    return this.mapService.getTiles();
  }

 /*  map = this.mapService.getTiles(); */
  rows = this.mapService.rows - 1;
  columns = this.mapService.columns - 1;

  

  investigation(){
    let houses=[];
    let choseHouse = [];

    for (let i = 0; i < this.map().length; i++) {
      for (let j = 0; j < this.map()[i].length; j++) {
        if(this.map()[i][j].house){
          houses.push([i,j])
      }}
  }
  while(houses.length < this.configurationsService.investigations){
  let randomHouse = Math.floor(Math.random() * houses.length);
  if (houses[randomHouse]!)
    choseHouse.push(houses[randomHouse]); }

  for (let i = 0; i < choseHouse.length; i++) {
    this.mapService.investigation(choseHouse[i][0], choseHouse[i][1], true);
  }

  
  }

  createRandomEnemy() {
    this.enemiesService.createRandomEnemy();
  }

  loadMap(map: string) {
    this.loadMapService.loadMap(map);
  }

  moveEnemy() {
    this.enemiesService.enemyAdvance();
  }

  clear(idR: number, idC: number) {
    this.mapService.alternateVisibility(idR, idC, true);

    //Si fuera casa, despejamos toda la manzana
    if (this.map()[idR][idC].house) {
      for (let i = 0; i < this.map.length; i++) {
        for (let j = 0; j < this.map()[i].length; j++) {
          if (this.map()[i][j].houseName === this.map()[idR][idC].houseName) {
            this.mapService.alternateVisibility(i, j, true);
          }
        }
      }

      //Despejamos toda la carretera
    } else {

     let steps: number = 0;

     // avisamos que al menos hay una carretera despejada
     this.configurationsService.clearRoad = true;

      // Comprobamos hasta donde llega la carretera hacia el Norte
      while (idR - steps > 0) {
        steps++;
        if (this.map()[idR - steps][idC].house === false) {
          this.mapService.alternateVisibility(idR - steps, idC, true);

          //Comprobamos qué fachadas se verían hacia e este y las despejamos
          if (idC > 0 && this.map()[idR - steps][idC - 1].house === true) {
            this.mapService.showRoof(idR - steps, idC - 1, 'E');
          }

          //Comprobamos qué fachadas se verían hacia e oeste y las despejamos
          if (idC < 7 && this.map()[idR - steps][idC + 1].house === true) {
            this.mapService.showRoof(idR - steps, idC + 1, 'W');
          }
        } else {
          this.mapService.showRoof(idR - steps, idC, 'S');
          break;
        }
      }
      // Comprobamos hasta donde llega la carretera hacia el sur
      steps = 0;
      while (idR + steps < this.rows) {
        steps++;
        if (this.map()[idR + steps][idC].house === false) {
          this.mapService.alternateVisibility(idR + steps, idC, true);
          if (idC < 7 && this.map()[idR + steps][idC + 1].house === true) {
            this.mapService.showRoof(idR + steps, idC + 1, 'W');
          }
          if (idC > 0 && this.map()[idR + steps][idC - 1].house === true) {
            this.mapService.showRoof(idR + steps, idC - 1, 'E');
          }
        } else {
          this.mapService.showRoof(idR + steps, idC, 'N');
          break;
        }
      }
      // Comprobamos hasta donde llega la carretera hacia el E
      steps = 0;
      while (idC + steps < this.columns) {
        steps++;
        if (this.map()[idR][idC + steps].house === false) {
          this.mapService.alternateVisibility(idR, idC + steps, true);
          if (idR < 7 && this.map()[idR + 1][idC + steps].house === true) {
            this.mapService.showRoof(idR + 1, idC + steps, 'N');
          }
          if (idR > 0 && this.map()[idR - 1][idC + steps].house === true) {
            this.mapService.showRoof(idR - 1, idC + steps, 'S');
          }
        } else {
          this.mapService.showRoof(idR, idC + steps, 'W');
          break;
        }
      }
      // Comprobamos hasta donde llega la carretera hacia el W
      steps = 0;
      while (idC - steps > 0) {
        steps++;
        if (this.map()[idR][idC - steps].house === false) {
          this.mapService.alternateVisibility(idR, idC - steps, true);
          if (idR > 0 && this.map()[idR - 1][idC - steps].house === true) {
            this.mapService.showRoof(idR - 1, idC - steps, 'S');
          }
          if (idR < 7 && this.map()[idR + 1][idC - steps].house === true) {
            this.mapService.showRoof(idR + 1, idC - steps, 'N');
          }
        } else {
          this.mapService.showRoof(idR, idC - steps, 'E');
          break;
        }
      }

      // comprobamos si la casilla es expandible
      let clerable = false;
      for (let i = 0; i < this.map.length; i++) {
        for (let j = 0; j < this.map()[i].length; j++) {
          if (
            this.map()[i][j].visible === true &&
            this.map()[i][j].house === false
          ) {
            if (
              i < this.rows &&
              this.map()[i + 1][j].visible != true &&
              this.map()[i + 1][j].house === false
            ) {
              clerable = true;
            }
            if (
              i > 0 &&
              this.map()[i - 1][j].visible != true &&
              this.map()[i - 1][j].house === false
            ) {
              clerable = true;
            }
            if (
              j < this.columns &&
              this.map()[i][j + 1].visible != true &&
              this.map()[i][j + 1].house === false
            ) {
              clerable = true;
            }
            if (
              j > 0 &&
              this.map()[i][j - 1].visible != true &&
              this.map()[i][j - 1].house === false
            ) {
              clerable = true;
            }
            if (clerable) {
              this.mapService.clearableTile(i, j, true);
              clerable = false;
            } else {
              this.mapService.clearableTile(i, j, false);
            }
          }
        }
      }
    }
  }
}

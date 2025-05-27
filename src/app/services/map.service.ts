import { Component, Injectable } from '@angular/core';
import { ITiles } from '../interfaces/tiles';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor() {
    /*  this.createMap() */
  }

  rows: number = 8;
  columns: number = 8;
  tiles: ITiles[][] = [];

  createMap() {
    for (let i = 0; i < this.rows; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < this.columns; j++) {
        this.tiles[i][j] = {
          idR: i,
          idC: j,
          clearableTile: false,
          visible: false,
          enemyLow: 0,
          enemyMedium: 0,
          enemySplitter: 0,
          enemyHigh: 0,
          enemyFinal: false,
          enemyRoute: 0,
          house: false,
          doorN: false,
          doorS: false,
          doorE: false,
          doorW: false,
        };
      }
    }
  }

  getTiles(): ITiles[][] {
    return this.tiles;
  }

  alternateHouse(idR: number, idC: number) {
    this.tiles[idR][idC].house = !this.tiles[idR][idC].house;
  }
  alternateVisibility(idR: number, idC: number, visiblility: boolean) {
    this.tiles[idR][idC].visible = visiblility;
  }

  showRoof(idR: number, idC: number, roof: string) {
    this.tiles[idR][idC].roof = true;
    if (roof === 'N') {
      this.tiles[idR][idC].roofN = true;
    } else if (roof === 'S') {
      this.tiles[idR][idC].roofS = true;
    } else if (roof === 'E') {
      this.tiles[idR][idC].roofE = true;
    } else if (roof === 'W') {
      this.tiles[idR][idC].roofW = true;
    }
  }
  clearableTile(idR: number, idC: number, clearableTile: boolean) {
    this.tiles[idR][idC].clearableTile = clearableTile;
  }
  createEnemy(idR: number, idC: number, enemy: string) {
switch(enemy) {
  case 'enemyLow':
    this.tiles[idR][idC].enemyLow++;
    break;
  case 'enemyMedium':
    this.tiles[idR][idC].enemyMedium++;
    break;
  case 'enemySplitter':
    this.tiles[idR][idC].enemySplitter++;
    break;  
    case 'enemyHigh':
    this.tiles[idR][idC].enemyHigh++;
    break;
  default:
    window.alert("error en la creación de enemigos")
  }
}

investigation(idR: number, idC: number, parameter: boolean) {
this.tiles[idR][idC].investigation = parameter;
  }
  
  eliminateAllEnemies(idR: number, idC: number) {
this.tiles[idR][idC].enemyLow = 0;
this.tiles[idR][idC].enemyMedium = 0;
this.tiles[idR][idC].enemySplitter = 0;
this.tiles[idR][idC].enemyHigh = 0;
  }

  

  enemyRoute(idR: number, idC: number, number: number) {
    this.tiles[idR][idC].enemyRoute = number;
  }
}

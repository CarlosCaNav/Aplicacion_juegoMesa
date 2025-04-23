import { Component, Injectable } from '@angular/core';
import { Tiles } from '../interfaces/ITiles';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor() {
    this.createMap()
  }

  rows: number = 8;
  columns: number = 8;
  tiles: Tiles[] = [];

  createMap() {
    let rows = 0;
    let columns = 0;

    for (let i = 0; i < this.columns * this.rows; i++) {
      columns = i % this.columns;
      rows = Math.floor(i / this.columns);

      this.tiles[i] = {
        id: i,
        idR: rows,
        idC: columns,
        house: false,
        houseName: '',
        streetH: 0,
        streetV: 0,
        enemys: [],
        enemyRoute: [],
        visible: false,
        investigation: false,
        roofN: false,
        roofS: false,
        roofE: false,
        roofW: false,
        doorN: false,
        doorS: false,
        doorE: false,
        doorW: false,
      };
    }
  }

  getTiles(): Tiles[] {
    return this.tiles;
  }
}

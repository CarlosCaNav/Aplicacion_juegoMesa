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
          house: false,
          doorN: false,
          doorS: false,
          doorE: false,
          doorW: false,
        }
      }
    }
  }

  getTiles(): ITiles[][] {
    return this.tiles;
  }

  alternateHause(idR: number, idC: number) {
    this.tiles[idR][idC].house = !this.tiles[idR][idC].house;
  }
  alternateVisibility(idR: number, idC: number, visiblility: boolean) {
    this.tiles[idR][idC].visible = visiblility;
  }
  showRoof(idR: number, idC: number, roof: string) {
   if(roof === 'N'){
    this.tiles[idR][idC].roofN = true;
   }else if(roof === 'S'){
    this.tiles[idR][idC].roofS = true;
   }else if(roof === 'E'){
    this.tiles[idR][idC].roofE = true;
   }else if(roof === 'W'){
    this.tiles[idR][idC].roofW = true;
   }
  }
}

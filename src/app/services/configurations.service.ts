import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationsService {
  constructor() {}

  page: string = 'menu'; //menu, editor, game
  menu: string = 'home'; //home, instructions, save
  initialEnemyProbabilityPerSquare: number = 10; //chance in 100 that there is an enemy per tile
  investigations: number = 8;
  objetsPerHouse: number = 15;
  doubleBreaakthoughProbability: number = 8; //sobre 100
  clearRoad: boolean = false; // if investigartos start in a house, enemies have no route.

  changePage(page: string) {
    this.page = page;
    }

  returnPage() {
    return this.page;
  }
}


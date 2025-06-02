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
  objetsPerRoom: number = 5;
  doubleBreaakthoughProbability: number = 8; //sobre 100
  phaseOne: number = 2;
  phaseTwo: number = 6;
  phaseThree: number = 8;

  clearRoad: boolean = false; // if investigartos start in a house, enemies have no route.
  currentPhase: number = 0;
  currentRound: number = 0;

  changePage(page: string) {
    this.page = page;
  }

  returnPage() {
    return this.page;
  }

  increaseCurrentRound() {
    this.currentRound++;
  }
}

import { MapService } from '../../services/map.service';
import { NgStyle, NgIf } from '@angular/common';
import { LoadMapService } from '../../services/load-map.service';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgStyle, NgIf],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  constructor() {}

  private mapService: MapService = inject(MapService);
  private loadMapService: LoadMapService = inject(LoadMapService);

  /* map = this.mapService.getTiles(); */
  map = this.mapService.getTiles();

  loadMap(map: string) {
    this.loadMapService.loadMap(map);
  }
  reloadMap() {
    this.map = this.mapService.tiles;
  }

  clear(idR: number, idC: number) {
    this.mapService.alternateVisibility(idR, idC, true);

    //Si fuera casa, despejamos toda al casa
    if (this.map[idR][idC].house) {
      for (let i = 0; i < this.map.length; i++) {
        for (let j = 0; j < this.map[i].length; j++) {
          if (this.map[i][j].houseName === this.map[idR][idC].houseName) {
            this.mapService.alternateVisibility(i, j, true);
          }
        }
      }

      //Despejamos toda la carretera
    } else {
      let attempts: number = 0;

      // Comprobamos hasta donde llega la carretera hacia el Norte
      while (idR - attempts > 0) {
        attempts++;
        if (this.map[idR - attempts][idC].house === false) {
          this.mapService.alternateVisibility( idR - attempts, idC, true);

          if (this.map[idR - attempts][idC - 1].house === true && idC > 1) { // arreglar esto            
            this.mapService.showRoof(idR - attempts, idC - 1, 'E');
          }

          if (this.map[idR - attempts][idC + 1].house === true && idC < 6) {
            this.mapService.showRoof(idR - attempts, idC + 1, 'W');
          }
        } else {
          this.mapService.showRoof(idR - attempts, idC, 'S');
          break;
        }
      }
      // Comprobamos hasta donde llega la carretera hacia el sur
      attempts = 0;
      while (idR + attempts < 7) {
        attempts++;
        if (this.map[idR + attempts][idC].house === false) {
          this.mapService.alternateVisibility(idR + attempts, idC, true);
          if (this.map[idR + attempts][idC + 1].house === true && idC < 8) {
            this.mapService.showRoof(idR + attempts, idC + 1, 'W');
          } 
          if (this.map[idR + attempts][idC - 1].house === true && idC > 0) {
            this.mapService.showRoof(idR + attempts, idC - 1, 'E');
          } 
        } else {
          this.mapService.showRoof(idR + attempts, idC, 'N');
          break;
        }
      }
      // Comprobamos hasta donde llega la carretera hacia el E
      attempts = 0;
      while (idC + attempts < 7) {
        attempts++;
        if (this.map[idR][idC + attempts].house === false) {
          this.mapService.alternateVisibility(idR, idC + attempts, true);
          if (this.map[idR + 1][idC + attempts].house === true && idR < 8) {
            this.mapService.showRoof(idR + 1, idC + attempts, 'N');
          }
          if (this.map[idR - 1][idC + attempts].house === true && idR > 0) {
            this.mapService.showRoof(idR - 1, idC + attempts, 'S');
          }
        } else {
          this.mapService.showRoof(idR, idC + attempts, 'W');
          break;
        }
      }
      // Comprobamos hasta donde llega la carretera hacia el W
      attempts = 0;
      while (idC - attempts > 0) {
        attempts++;
        if (this.map[idR][idC - attempts].house === false) {
          this.mapService.alternateVisibility(idR, idC - attempts, true);
          if (this.map[idR - 1][idC - attempts].house === true && idR > 0) {
            this.mapService.showRoof(idR - 1, idC - attempts, 'S');
          }
          if (this.map[idR + 1][idC - attempts].house === true && idR < 8) {
            this.mapService.showRoof(idR + 1, idC - attempts, 'N');
          }
        } else {
          this.mapService.showRoof( idR, idC - attempts,'E');
          break;
        }
      }
    }
  }
}

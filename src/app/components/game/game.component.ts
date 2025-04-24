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

  clear(idC: number, idR: number) {
    this.mapService.alternateVisibility(idC, idR, true);

    //Si fuera casa, despejamos toda al casa
    if (this.map[idR][idC].house) {
      for (let i = 0; i < this.map.length; i++) {
        for (let j = 0; j < this.map[i].length; j++) {
          if (this.map[i][j].houseName === this.map[idR][idC].houseName) {
            this.mapService.alternateVisibility(j, i, true);
          }
        }
      }

      //Despejamos toda la carretera
    } else {
      let limit: number = 8;
      let attempts: number = 0;

      // Comprobamos hasta donde llega la carretera hacia el Norte
      while (idR - attempts > 0) {
        attempts++;
        if (this.map[idR - attempts][idC].house === false ) {
          this.mapService.alternateVisibility(idC, idR - attempts, true);
   /*      } else if (this.map[idR - attempts][idC].house === true) {
          this.map[idR - attempts][idC].roofS === true;
          
          break; */
        } else {
          this.mapService.showRoof(idC, idR - attempts, 'S');
          break;
        }
      }
      // Comprobamos hasta donde llega la carretera hacia el sur
          attempts = 0;
      while (idR + attempts < 7) {
        attempts++;
        if (this.map[idR + attempts][idC].house === false) {
          this.mapService.alternateVisibility(idC, idR + attempts, true);
        } else {
          this.mapService.showRoof(idC, idR + attempts, 'N');
          break;
        }
      }
      // Comprobamos hasta donde llega la carretera hacia el E
          attempts = 0;
      while (idC + attempts < 7) {
        attempts++;
        if (this.map[idR][idC + attempts].house === false) {
          this.mapService.alternateVisibility(idC + attempts, idR, true);
        } else {
          this.mapService.showRoof(idC + attempts, idR, 'W');
          break;
        }
      }
      // Comprobamos hasta donde llega la carretera hacia el W
          attempts = 0;
      while (idC - attempts > 0) {
        attempts++;
        if (this.map[idR][idC - attempts].house === false) {
          this.mapService.alternateVisibility(idC - attempts, idR, true);
        } else {
          this.mapService.showRoof(idC - attempts, idR, 'E');
          break;
        }
      }
    }
  }
}

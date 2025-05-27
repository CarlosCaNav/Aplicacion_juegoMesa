import { Component, OnInit, inject } from '@angular/core';
import { NgStyle, NgIf } from '@angular/common';
import { MapService } from '../../services/map.service';
import { LoadMapService } from '../../services/load-map.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [NgStyle, NgIf],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements OnInit {
  title = 'JuegoMesa';

  private mapService: MapService = inject(MapService);
  private loadMapService: LoadMapService = inject(LoadMapService);
/* 
  map: ITiles[][] = this.loadMapService.loadMap('redemption') || [];
 */

  map = this.mapService.getTiles();



  ngOnInit(): void {
    this.mapService.createMap();
  }

  alternateHouse(idR: number, idC: number) {
    this.mapService.alternateHouse(idR, idC);
  }
  createNameHouse() {
    let name: number = 0;

    for (let i = 0; i < this.map.length; i++) {
      name++
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j].house) {
          this.map[i][j].houseName = name;
          if (i > 0 && this.map[i -1][j].house) {
            console.log(
              'casa anterior' + this.map[i - 1][j].houseName,
              "columna" + this.map[i][j].idC,
              "fila" + this.map[i][j].idR,
              'y la nueva casa es' + this.map[i][j].houseName
            );

            this.replaceHouseName(this.map[i - 1][j].houseName, name);
          } 
        } else {
          name++;
        }
      }
    }
  }
  replaceHouseName(originalName: number | undefined, newName: number) {
    console.log('originalName', originalName, 'newName', newName);

    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j].houseName === originalName) {
          this.map[i][j].houseName = newName;
        }
      }
    }
  }
  saveMapLocalStorage() {
    localStorage.setItem('map', JSON.stringify(this.map));
    }
  loadMapLocalStorage() {
    const map = localStorage.getItem('map');
    if (map) {
      this.map = JSON.parse(map);
    }
  }
  downloadMap() {

    this.createNameHouse();

    const data = JSON.stringify(this.map);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'map.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  loadMap(map : string) {
    this.loadMapService.loadMap(map);
    
  }
  reloadMap(){this.map = this.mapService.tiles;}



}

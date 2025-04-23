import { Component, OnInit, inject } from '@angular/core';
import { NgStyle, NgIf } from '@angular/common';
import { MapService } from '../../services/map.service';

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

  map = this.mapService.getTiles();

  ngOnInit(): void {
    this.mapService.createMap();
  }

  alternateHause(idC: number, idR: number) {
    this.mapService.alternateHause(idC, idR);
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
}

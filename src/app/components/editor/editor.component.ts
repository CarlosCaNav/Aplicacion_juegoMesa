import { Component, OnInit, inject } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MapService } from '../../services/map.service';



@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})

export class EditorComponent implements OnInit {
  title = 'JuegoMesa';

private mapService: MapService = inject(MapService);

map = this.mapService.getTiles();

  ngOnInit(): void {
    this.mapService.createMap();
  }

  alternateTerrain(id : number){
    this.map[id].house = !this.map[id].house;
  }

}

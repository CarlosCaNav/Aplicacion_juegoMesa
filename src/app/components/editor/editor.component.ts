import { Component, OnInit, inject } from '@angular/core';
import { NgStyle, NgIf } from '@angular/common';
import { MapService } from '../../services/map.service';



@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [NgStyle, NgIf],
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


}

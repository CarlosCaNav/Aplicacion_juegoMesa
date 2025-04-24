import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapService } from './map.service';
import { ITiles } from '../interfaces/tiles';


@Injectable({
  providedIn: 'root'
})
export class LoadMapService {

  constructor() { }

  private http: HttpClient = inject(HttpClient);
  public mapService: MapService = inject(MapService);

  mapasDisponibles: { name: string; url: string }[] = [
    { name: 'redemption', url: '/maps/redemption.json' },
  ];

  loadMap(mapaElegido: string): ITiles[][]| void {
    console.log("llegó aquí también? ",
      this.mapService.getTiles()
    );
    /* 
    if (mapaElegido === 'aleatorio') {
      const aleatorio = Math.floor(
        Math.random() * this.mapasDisponibles.length
      );

      let map: Tiles[][] = [];

      this.http
        .get<Tiles[][]>(this.mapasDisponibles[aleatorio].url)
        .subscribe((data) => {
          map = data;
          this.mapService.tiles = map;
        });
      
    } else { */
      const mapaEncontrado = this.mapasDisponibles.find((m) => m.name === mapaElegido);
      if (!mapaEncontrado) {
        console.error('Mapa no encontrado');
        return;
      }

      this.http
        .get<ITiles[][]>(mapaEncontrado.url)
        .subscribe((data: ITiles[][]) => {
          console.log(data);
          
          this.mapService.tiles  = data ;
        });
        console.log(this.mapService.getTiles());
    }
}

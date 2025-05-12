import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapService } from './map.service';
import { ITiles } from '../interfaces/tiles';
import { ConfigurationsService } from './configurations.service';
import { EnemiesService } from './enemies.service';


@Injectable({
  providedIn: 'root'
})
export class LoadMapService {

  constructor() { }

  private http: HttpClient = inject(HttpClient);
  private mapService: MapService = inject(MapService);
  private configurationsService: ConfigurationsService = inject(ConfigurationsService);
  private enemiesService: EnemiesService = inject(EnemiesService);

map(): ITiles[][] {
  return this.mapService.getTiles();
}

  mapasDisponibles: { name: string; url: string }[] = [
    { name: 'redemption', url: '/maps/redemption.json' },
  ];

  loadMap(mapaElegido: string): ITiles[][]| void {
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

      this.configurationsService.clearRoad = false;

      this.http
        .get<ITiles[][]>(mapaEncontrado.url)
        .subscribe((data: ITiles[][]) => {
          console.log(data);
          
          this.mapService.tiles  = data ;
          this.enemiesService.initialEnemies();
          this.investigation();
        });
        this.configurationsService.changePage('game');
    }
    investigation(){
      let houses=[];
      let choseHouse = [];
  
      for (let i = 0; i < this.map().length; i++) {
        for (let j = 0; j < this.map()[i].length; j++) {
          if(this.map()[i][j].house){
            houses.push([i,j])
            
        }}
    }
    while(choseHouse.length < this.configurationsService.investigations){
    let randomHouse = Math.floor(Math.random() * houses.length);
    console.log("holi?");
    
    if (houses[randomHouse]!)
      choseHouse.push(houses[randomHouse]); }
  
    for (let i = 0; i < choseHouse.length; i++) {
      this.mapService.investigation(choseHouse[i][0], choseHouse[i][1], true);
      console.log("casas", choseHouse[i]);      
    }
  
    
    }
  
}

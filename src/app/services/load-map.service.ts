import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapService } from './map.service';
import { ITiles } from '../interfaces/tiles';
import { ConfigurationsService } from './configurations.service';
import { EnemiesService } from './enemies.service';

@Injectable({
  providedIn: 'root',
})
export class LoadMapService {
  constructor() {}

  private http: HttpClient = inject(HttpClient);
  private mapService: MapService = inject(MapService);
  private configurationsService: ConfigurationsService = inject(
    ConfigurationsService
  );
  private enemiesService: EnemiesService = inject(EnemiesService);

  map(): ITiles[][] {
    return this.mapService.getTiles();
  }

  mapasDisponibles: { name: string; url: string }[] = [
    { name: 'redemption', url: '/maps/redemption.json' },
    { name: 'carlos', url: '/maps/carlos.json' },
    { name: 'diego', url: '/maps/diego.json' },
    { name: 'tetris', url: '/maps/tetris.json' },
    { name: 'bro', url: '/maps/bro.json' },
  ];

  loadMap(chosenMap: string): ITiles[][] | void {
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

 let mapName = "";

if (chosenMap === 'random') {
  const ramdon = Math.floor(
    Math.random() * this.mapasDisponibles.length
  );
  mapName = this.mapasDisponibles[ramdon].name;
} else {
  mapName = chosenMap;
}

    const mapaEncontrado = this.mapasDisponibles.find(
      (m) => m.name === mapName
    );
    if (!mapaEncontrado) {
      window.alert('Mapa no encontrado');
      return;
    }

    this.configurationsService.clearRoad = false;

    this.http
      .get<ITiles[][]>(mapaEncontrado.url)
      .subscribe((data: ITiles[][]) => {

        this.mapService.tiles = data;
        this.enemiesService.initialEnemies();
        this.investigation();
        this.startTile();
        this.createObjects();
      });
    this.configurationsService.changePage('game');
  }
  investigation() {
    let houses = [];
    let choseHouse = [];

    for (let i = 0; i < this.map().length; i++) {
      for (let j = 0; j < this.map()[i].length; j++) {
        if (this.map()[i][j].house) {
          houses.push([i, j]);
        }
      }
    }
    while (choseHouse.length < this.configurationsService.investigations) {
      let randomHouse = Math.floor(Math.random() * houses.length);

      if (houses[randomHouse]!) choseHouse.push(houses[randomHouse]);
    }

    for (let i = 0; i < choseHouse.length; i++) {
      this.mapService.investigation(choseHouse[i][0], choseHouse[i][1], true);
    }
  }

  startTile() {
    let randomTile = Math.floor(Math.random() * this.map().length);
    let randomTile2 = Math.floor(Math.random() * this.map()[randomTile].length);

    this.mapService.alternateVisibility(
      randomTile,
      randomTile2,
      true
    );

    this.mapService.clearableTile(randomTile, randomTile2, true);
  }

createObjects() {
  for (let i = 0; i < this.map().length; i++) {
    for (let j = 0; j < this.map()[i].length; j++) {
      this.mapService.objects(i, j, this.configurationsService.objetsPerRoom);
    }
  }
}
}

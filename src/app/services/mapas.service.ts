import { Injectable } from '@angular/core';
import { DatosService } from './datos.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapasService {
  constructor(public datosService: DatosService, private http: HttpClient) {}

  mapasDisponibles: { nombre: string; url: string }[] = [
    { nombre: 'Valenzuela City', url: '/mapas/valenzuela_city.json' },
    { nombre: 'Bolaños', url: '/mapas/bolanios.json' },
    { nombre: 'Almagro', url: '/mapas/almagro.json' },
    { nombre: 'Primer', url: '/mapas/primer.json' },
    { nombre: 'Galo', url: '/mapas/galo.json' },
    { nombre: 'Elara', url: '/mapas/elara.json' },
    { nombre: 'Diego', url: '/mapas/diego.json' },
    { nombre: 'Bro', url: '/mapas/bro.json' },
    { nombre: 'Carnaval', url: '/mapas/carnaval.json'},
  ];

  cargarMapa(mapaElegido: string): any[] | void {
    if (mapaElegido === 'aleatorio') {
      const aleatorio = Math.floor(
        Math.random() * this.mapasDisponibles.length
      );

      let mapa: any[] = [];

      this.http
        .get<any[]>(this.mapasDisponibles[aleatorio].url)
        .subscribe((data) => {
          mapa = data;
          this.datosService.mapaActual = mapa;
        });
      return mapa;
      
    } else {
      const mapaEncontrado = this.mapasDisponibles.find((m) => m.nombre === mapaElegido);
      if (!mapaEncontrado) {
        console.error('Mapa no encontrado');
        return;
      }

      let mapa: any[] = [];

      this.http
        .get<any[]>(mapaEncontrado.url)
        .subscribe((data) => {
          mapa = data;
          this.datosService.mapaActual = mapa;
        });
      return mapa;
    }
    
  }
}

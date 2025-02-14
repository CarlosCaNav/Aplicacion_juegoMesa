import { Injectable } from '@angular/core';
import { DatosService } from './datos.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapasService {
  constructor(public datosService: DatosService, private http: HttpClient) {   }

  private valenzuela = '/mapas/valenzuela_city.json';
  private bolanios = '/mapas/bolanios.json';
  private almagro = '/mapas/almagro.json';
  private primer = '/mapas/primer.json';


  mapasDisponibles: string[] = [this.valenzuela,this.bolanios,this.almagro,this.primer];
/* 
  cargarMapa(): Observable<any> {
    return this.http.get(this.valenzuela);
  } */



cargarMapaAleatorio(){
  const aleatorio = Math.floor(Math.random() * this.mapasDisponibles.length);

let mapa: any[] = []

   this.http.get<any[]>(this.mapasDisponibles[aleatorio]).subscribe(data => {
    mapa = data;
   this.datosService.mapaActual = mapa;
  });
  return mapa;


/* let valenzuela = this.http.get('/mapas/valenzuela_city.json'); */

 /*    this.datoservice.mapaActual = JSON.parse(this.mapasService.cargarMapa()); */
  }
}


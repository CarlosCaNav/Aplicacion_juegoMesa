import { Component } from '@angular/core';
/* import { RouterOutlet } from '@angular/router'; */
import { JuegoComponent } from "./juego/juego.component";
import { BusquedaComponent } from "./busqueda/busqueda.component";
import { NgIf } from '@angular/common';
import { DatosService } from './services/datos.service';
import { SeleccionMapaComponent } from "./seleccion-mapa/seleccion-mapa.component";

@Component({
  selector: 'app-root',
  imports: [JuegoComponent, BusquedaComponent, NgIf, SeleccionMapaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor (public datosService: DatosService){}
  title = 'mapas';

  cerrarBusqueda(){
    this.datosService.armaEncontrada = ''
  }
}

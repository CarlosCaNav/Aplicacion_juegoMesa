import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JuegoComponent } from "./juego/juego.component";
import { BusquedaComponent } from "./busqueda/busqueda.component";
import { NgIf } from '@angular/common';
import { DatosService } from './datos.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JuegoComponent, BusquedaComponent, NgIf],
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

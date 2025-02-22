import { Component } from '@angular/core';
import { DatosService } from '../services/datos.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-busqueda',
  imports: [NgIf],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent {
  constructor (public datosService: DatosService){}

  cerrarBusqueda(){
    this.datosService.armaEncontrada = ''
  }
}

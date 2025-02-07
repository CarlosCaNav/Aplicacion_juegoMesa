import { Component } from '@angular/core';
import { DatosService } from '../datos.service';

@Component({
  selector: 'app-busqueda',
  imports: [],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent {
  constructor (public datosService: DatosService){}

  cerrarBusqueda(){
    this.datosService.armaEncontrada = ''
  }
}

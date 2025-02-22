import { NgFor, NgStyle} from '@angular/common';
import { Component } from '@angular/core';
import { DatosService } from '../services/datos.service';
import { MapasService } from '../services/mapas.service';
import { AlmacenamientoService } from '../services/almacenamiento.service';

@Component({
  selector: 'app-seleccion-mapa',
  imports: [NgFor, NgStyle],
  templateUrl: './seleccion-mapa.component.html',
  styleUrl: './seleccion-mapa.component.css'
})
export class SeleccionMapaComponent {

  constructor(public datosService: DatosService, public mapasService: MapasService, public almacenamientoService: AlmacenamientoService) { }

  
}

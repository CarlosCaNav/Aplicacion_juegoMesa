import { NgFor, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { DatosService } from '../datos.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-juego',
  imports: [NgFor, ReactiveFormsModule, NgStyle],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent {
  constructor(public datoservice: DatosService) {
    this.crearmapa()
    }

/* 
      calleH: number;
      calleV: number;
      casa: string;
      visible: boolean;
      enemigo: string;
      pista: boolean */
      
      aniadir: FormGroup = new FormGroup({
        nombre: new FormControl(undefined, Validators.required),
        eleccion: new FormControl(''),
        arroz: new FormControl(false),
        pasta: new FormControl(false),
        verduras: new FormControl(false),
        carnes: new FormControl(false),
        carnes_picadas: new FormControl(false),
        pescados: new FormControl(false),

    })

crearmapa(){
  this.datoservice.mapaActual = [];
    for (var i = 0; i <= this.datoservice.numeroLosetas; i++) {
      this.datoservice.mapaActual.push({
        id: i,
        calleH: 0,
        calleV: 0,
        casa: '',
        carretera: false,
        enemigo: 'Ninguno',
        visible: false,
        pista: false,
      });
    }}

    modificarLoseta() {

    }
}

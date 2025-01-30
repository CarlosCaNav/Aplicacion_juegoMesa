import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { DatosService } from '../datos.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-juego',
  imports: [NgFor, ReactiveFormsModule, NgStyle, NgIf],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css',
})
export class JuegoComponent {
  constructor(public datoservice: DatosService) {
    this.crearmapa();
  }

  /* 
      calleH: number;
      calleV: number;
      casa: string;
      visible: boolean;
      enemigo: string;
      pista: boolean */

  nombreMapa: FormGroup = new FormGroup({
    nombre: new FormGroup(''),
  });

  parametrosLoseta: FormGroup = new FormGroup({
    calleH: new FormControl(),
    calleV: new FormControl(),
    casa: new FormControl(''),
    enemigo: new FormControl(''),
    pista: new FormControl(false),
  });

  crearmapa() {
    this.datoservice.mapaActual = [];
    for (var i = 0; i <= this.datoservice.numeroLosetas; i++) {
      this.datoservice.mapaActual.push({
        id: i,
        calleH: 0,
        calleV: 0,
        casa: '',
        carretera: false,
        enemigo: '',
        visible: false,
        pista: false,
      });
    }
  }

  alternarTipo(id: number) {
    this.datoservice.mapaActual[id].carretera =
      !this.datoservice.mapaActual[id].carretera;
  }
  alternarVisibilidad(id: number) {
    this.datoservice.mapaActual[id].visible =
      !this.datoservice.mapaActual[id].visible;
  }

  jugar() {
    for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      if (this.datoservice.mapaActual[63].visible)
        this.datoservice.mapaActual[i].visible = false;
      else {
        this.datoservice.mapaActual[i].visible = true;
      }
    }
  }
  editar() {
    this.datoservice.editar = !this.datoservice.editar;

    for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      if (this.datoservice.editar)
        this.datoservice.mapaActual[i].visible = true;
      else {
        this.datoservice.mapaActual[i].visible = false;
      }
    }
  }

  limpiarForm() {
    this.parametrosLoseta.reset();
  }

  aplicar(id: number) {
    if (this.parametrosLoseta.value.calleH != 0) {
      this.datoservice.mapaActual[id].calleH =
        this.parametrosLoseta.value.calleH;
    } else if (this.parametrosLoseta.value.calleH != 0) {
      this.datoservice.mapaActual[id].calleV =
        this.parametrosLoseta.value.calleV;
    } else if (this.parametrosLoseta.value.calleH != 0) {
      this.datoservice.mapaActual[id].casa = this.parametrosLoseta.value.casa;
    }
  }

  aplicarAutomaticamente() {
    var horizontal: number = 1;
    const descarteHorizontal = [8, 16, 24, 32, 40, 48, 56];
    var vertical: number = 2;

    for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      if (this.datoservice.mapaActual[i].casa == '') {
        if (descarteHorizontal.includes(i)) {
          horizontal += 2;
        }
        this.datoservice.mapaActual[i].calleH = horizontal;
      } else {
        horizontal += 2;
      }
    }
    for (var i = 0; i <= 7; ++i) {
      vertical += 2;
      for (var j = 0; j <= 63; j += 8) {
        if (this.datoservice.mapaActual[j + i].casa == '') {
          this.datoservice.mapaActual[j + i].calleV = vertical;
        } else vertical += 2;
      }
    }
  }

  despejar(id: number) {
    const calleH: number = this.datoservice.mapaActual[id].calleH;
    const calleV: number = this.datoservice.mapaActual[id].calleV;
    const descarteHorizontal = [8, 16, 32, 40, 48, 56];

    for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      if (
        this.datoservice.mapaActual[i].calleH == calleH ||
        this.datoservice.mapaActual[i].calleV == calleV
      ) {
        this.datoservice.mapaActual[i].visible = true;

        if (this.datoservice.mapaActual[i + 8].casa != '' && i + 8 <= 63) {
          this.datoservice.mapaActual[i + 8].visible = true;
        }
        if (i >= 8 && this.datoservice.mapaActual[i - 8].casa != ''  ) {
          this.datoservice.mapaActual[i - 8].visible = true;
        } 

        
        if (
          this.datoservice.mapaActual[i + 1].casa != '' &&
          !descarteHorizontal.includes(i - 1)
        ) {
          this.datoservice.mapaActual[i + 1].visible = true;
        }
        if (
          this.datoservice.mapaActual[i - 1].casa != '' &&
          !descarteHorizontal.includes(i)
        ) {
          this.datoservice.mapaActual[i - 1].visible = true;
        } 
      }
    }
  }

  guardarDatos() {
    const data = JSON.stringify(this.datoservice.mapaActual);
    localStorage.setItem(this.datoservice.nombreMapaActual, data);
  }
  cargarDatos() {
    const data = localStorage.getItem(this.datoservice.nombreMapaActual);
    if (data) {
      this.datoservice.mapaActual = JSON.parse(data);
    }
  }
}

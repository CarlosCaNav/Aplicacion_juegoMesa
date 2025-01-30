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
        carretera: true,
        enemigo: '',
        visible: true,
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
/* 
  jugar() {
    for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      if (this.datoservice.mapaActual[63].visible)
        this.datoservice.mapaActual[i].visible = false;
      else {
        this.datoservice.mapaActual[i].visible = true;
      }
    }
  } */
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
    const descarteHorizontal = [0, 8, 16, 24, 32, 40, 48, 56, 64];
    var horizontal: number = 1;
    var vertical: number = 2;
    var casa: number = 0;
    var provisional: string = '';

    //comprobamos horizontalmente si es edificio. Si lo es le aplicamos la C y un número
    // y comprobamos la siguiente. Si es también edificio se repite el número, si no se cambia
    for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      if (this.datoservice.mapaActual[i].carretera == false) {
        this.datoservice.mapaActual[i].casa = 'c' + casa;
      } else {
        casa += 1;
      }
    }
    //prepara las contiguas verticales
    for (var i = 0; i <= 7; ++i) {
      for (var j = 0; j <= 63; j += 8) {
        if (
          this.datoservice.mapaActual[j + i].casa != '' &&
          provisional == ''
        ) {
          provisional = this.datoservice.mapaActual[j + i].casa;
        } else if (
          this.datoservice.mapaActual[j + i].casa != '' &&
          provisional != ''
        ) {
          for (var k = 0; k < this.datoservice.numeroLosetas; ++k) {
            
            if (this.datoservice.mapaActual[k].casa == this.datoservice.mapaActual[j + i].casa) {
              this.datoservice.mapaActual[k].casa = provisional;
            }
          }
        } else {
          provisional = '';
        }
      }
    }

    // prepara las contiguas horizontales
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
    //prepara las contiguas verticales
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
    const descarteHorizontal = [0, 8, 16, 24, 32, 40, 48, 56, 64];

    for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {

      if (
        this.datoservice.mapaActual[i].calleH == calleH ||
        this.datoservice.mapaActual[i].calleV == calleV
      ) {
        this.datoservice.mapaActual[i].visible = true;

        if (i + 8 <= 63 && this.datoservice.mapaActual[i + 8].casa != '') {
          this.datoservice.mapaActual[i + 8].visible = true;
        }
        if (i >= 8 && this.datoservice.mapaActual[i - 8].casa != '') {
          this.datoservice.mapaActual[i - 8].visible = true;
        }

        if (
          i < 63 &&
          !descarteHorizontal.includes(i - 1) &&
          this.datoservice.mapaActual[i + 1].casa != ''
        ) {
          this.datoservice.mapaActual[i + 1].visible = true;
        }
        if (
          i > 0 &&
          !descarteHorizontal.includes(i) &&
          this.datoservice.mapaActual[i - 1].casa != ''
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

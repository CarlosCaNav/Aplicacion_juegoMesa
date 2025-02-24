import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { DatosService } from '../services/datos.service';
import { MapasService } from '../services/mapas.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EditarService } from '../services/editar.service';
import { AlmacenamientoService } from '../services/almacenamiento.service';

@Component({
  selector: 'app-juego',
  imports: [NgFor, ReactiveFormsModule, NgStyle, NgIf],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css',
})
export class JuegoComponent {
  constructor(
    public datosService: DatosService,
    public mapasService: MapasService,
    public editarService: EditarService,
    public almacenamientoService: AlmacenamientoService,
    private http: HttpClient
  ) {
    this.editarService.crearmapa();
    this.almacenamientoService.obtenerClavesLocalStorage();
  }

  /* 
      calleH: number;
      calleV: number;
      casa: string;
      visible: boolean;
      enemigo: string;
      pista: boolean */




  ronda() {
    if (this.datosService.casillasConSalidaEnemigos.length === 0) {
      this.datosService.casillasConSalidaEnemigos =
        this.editarService.arrayConSalidaDeEnemigos();
      console.log('Casillas de inicio creadas.');
    }

    // Limpiamos el mapa
    for (let i = 0; i < this.datosService.mapaActual.length; ++i) {
      this.datosService.mapaActual[i].enemigos = [];
      if (
        this.datosService.mapaActual[i].visible &&
        (this.datosService.mapaActual[i].carretera ||
          this.datosService.casasDespejadas.includes(
            this.datosService.mapaActual[i].casa
          ))
      ) {
        this.datosService.mapaActual[i].pista = false;
        this.datosService.mapaActual[i].enemigos = [];
        // Eliminamos las rutas de los enemigos que estaban en esta casilla
        for (let j = 0; j < this.datosService.enemigos.length; ++j) {
          for (let k = 0; k < this.datosService.enemigos[j].rutas.length; ++k) {
            const ruta = this.datosService.enemigos[j].rutas[k];

            /* 
            if (ruta.includes(i)) {
              // Si el enemigo tiene una ruta que pasa por esta casilla, eliminamos esa ruta
              this.datosService.Enemigos[j].rutas.splice(k, 1);
              k--; // Ajustamos el índice porque eliminamos un elemento
            } */

            if (ruta[0] == i) {
              // Si el enemigo tiene una ruta que pasa por esta casilla, eliminamos esa ruta
              /*  this.datosService.Enemigos[j].rutas[k].shift(); */
              this.datosService.enemigos[j].rutas.splice(k, 1);
            }
          }
        }
      }
      //añadimos los enemigos iniciales
      else if (
        this.editarService.posicionEnemigosIniciales.includes(i) &&
        this.datosService.mapaActual[i].visible == false
      ) {
        this.datosService.mapaActual[i].enemigos = ['reptador'];
      }
    }

    // Movemos a los enemigos
    for (let i = 0; i < this.datosService.enemigos.length; ++i) {
      for (let j = 0; j < this.datosService.enemigos[i].rutas.length; ++j) {
        const ruta = this.datosService.enemigos[i].rutas[j];
        if (ruta.length > 0) {
          let pasos = Math.min(
            ruta.length,
            this.datosService.enemigos[i].avance
          );
          ruta.splice(0, pasos);

          if (ruta.length > 0) {
            this.datosService.mapaActual[ruta[0]].enemigos.push(
              this.datosService.enemigos[i].enemigo
            );
          }
        } else {
          this.datosService.enemigos[i].rutas.splice(j, 1);
          j--;
        }
      }
    }
    //comprobamos si algún enemigo se mueve una casilla más
    const numeroAleatorio = Math.floor(Math.random() * 100);
    const enemigoAleatorio = Math.floor(
      Math.random() * (this.datosService.fase + 1)
    );
    if (
      numeroAleatorio < this.datosService.probabilidadAvanceDoble &&
      enemigoAleatorio < this.datosService.fase + 1
    ) {
      this.datosService.enemigoAvanceAdicional = this.datosService.enemigos[enemigoAleatorio].enemigo;
      this.datosService.emergente('enemigoAvanza');
    }

    //comprobamos si hay que incrementar la fase
    switch (this.datosService.ronda) {
      case this.datosService.rondaPrimeraFase:
        this.datosService.fase = 1;
        break;
      case this.datosService.rondaSegundaFase:
        this.datosService.fase = 2;
        break;
      case this.datosService.rondaTerceraFase:
        this.datosService.fase = 3;
        this.datosService.emergenteMostrado = 'primigenioDespertando'
        const numeroAleatorio = Math.floor(
          Math.random() * this.datosService.numeroLosetas
        );
        this.datosService.mapaActual[numeroAleatorio].enemigos.push(
          'PRIMIGENIO'
        );
        this.datosService.casillaPrimigenio = numeroAleatorio;
        if (this.datosService.mapaActual[numeroAleatorio].visible == false) {
          {
            if (this.datosService.pistasEncontradas >= 2) {
              this.datosService.mapaActual[numeroAleatorio].visible = true;
            }
          }
        }
        break;
      case this.datosService.rondaCuartaFase:
        this.datosService.fase = 4;
        this.datosService.emergente('investigadoresPierden');
        break;
    }

    console.log('la fase es ' + this.datosService.fase);

    //creamos enemigos nuevos
    //creamos el primer enemigo obligatorio
    this.nuevoEnemigo();
    //creamos un número aleatorio entre 0 y el mazo de enemigos simples
    const numerOMAzoAleatorio = Math.floor(
      Math.random() * this.datosService.mazoEnemigosSimples
    );
    console.log(numerOMAzoAleatorio + ' y ronda ' + this.datosService.ronda);

    //comprobamos si añadimos un segundo
    if (this.datosService.ronda > this.datosService.mazoEnemigosSimples) {
      this.nuevoEnemigo();
      //comprobamos si añadimos un tercero
      if (
        numerOMAzoAleatorio + this.datosService.mazoEnemigosSimples < this.datosService.ronda
      ) {
        this.nuevoEnemigo();
      }
    } else {
      if (numerOMAzoAleatorio < this.datosService.ronda) {
        this.nuevoEnemigo();
      }
    }

    // si el primigenio está despierto, comprobamos si ataca:
    if (this.datosService.ronda > this.datosService.rondaTerceraFase){
     const aleatorio:number= Math.floor(Math.random() * 100);
     console.log(aleatorio);
     if (aleatorio < this.datosService.probabilidadAtaquePrimigenio){
      this.datosService.emergente('primigenioAtaca')
     }
    }

    // Incrementamos la ronda
    this.datosService.ronda++;

    // Guardamos los datos
    this.almacenamientoService.guardadoAutomatico();
  }

  nuevoEnemigo() {
    //El enemigo aleatorio hay que cambiarlo en un futuro, ya que ahora hay sólo 4,
    // pero en el futuro puede haber diferentes enemigos en una misma fase.
    //a demás no cuenta la probabilidad de cada uno
    const enemigoAleatorio = Math.floor(
      Math.random() * (this.datosService.fase + 1)
    );
    const losetaAleatoria = Math.floor(
      Math.random() * this.datosService.casillasConSalidaEnemigos.length
    );

    // Añadimos un nuevo enemigo
    //Le añadimos la ruta a seguir al enemigo
    const nuevaRuta = [
      ...this.datosService.mapaActual[
        this.datosService.casillasConSalidaEnemigos[losetaAleatoria]
      ].rutasEnemigos,
    ];

    this.datosService.enemigos[enemigoAleatorio].rutas.push(nuevaRuta);

    //marcamos en el mapa la ubicación del enemigo
    this.datosService.mapaActual[
      this.datosService.casillasConSalidaEnemigos[losetaAleatoria]
    ].enemigos.push(this.datosService.enemigos[enemigoAleatorio].enemigo);
  }


}

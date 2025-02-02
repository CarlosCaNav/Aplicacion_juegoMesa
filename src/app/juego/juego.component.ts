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
    enemigos: new FormControl(''),
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
        enemigos: [],
        rutasEnemigos: [],
        visible: true,
        pista: false,
        puertaSup: false,
        puertaInf: false,
        puertaDer: false,
        puertaIzq: false,
      });
    }
  }
  //Alterna entre si es carretera o casa
  alternarTipo(id: number) {
    this.datoservice.mapaActual[id].carretera =
      !this.datoservice.mapaActual[id].carretera;
  }
  /* 
  creo que esto ya no se usa así que lo voy a comentar para asegurarme
  alternarVisibilidad(id: number) {
    this.datoservice.mapaActual[id].visible =
      !this.datoservice.mapaActual[id].visible;
  } */

  editar() {
    this.datoservice.editar = !this.datoservice.editar;

    // alternamos la visibilidad de todo el tablero para poderlo ver
    //para editar, u ocultarlo para jugar
    for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      if (this.datoservice.editar)
        this.datoservice.mapaActual[i].visible = true;
      else {
        this.datoservice.mapaActual[i].visible = false;
      }
    }
  }
  /* 
  Esto también creo que ya no se usa
  limpiarForm() {
    this.parametrosLoseta.reset();
  } */

  /* 
    Esto también creo que ya no se usa
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
  } */

  aplicarAutomaticamente() {
    //con esto comprobamos la visibilidad de cada loseta
    const descarteHorizontal = [0, 8, 16, 24, 32, 40, 48, 56, 64];
    var horizontal: number = 1;
    var vertical: number = 2;
    var casa: number = 0;
    var provisional: string = '';

    // Borra todos los datos
    for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      this.datoservice.mapaActual[i].casa = '';
      this.datoservice.mapaActual[i].calleH = 0;
      this.datoservice.mapaActual[i].calleH = 0;
    }

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
            if (
              this.datoservice.mapaActual[k].casa ==
              this.datoservice.mapaActual[j + i].casa
            ) {
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

  crearRecursos() {
    //juntamos todas las probabliidades de búsqueda
    let probablilidades: number = 0;
    let sumatorio = 0;
    let recursos: string[] = [];

    for (let i = 0; i <= this.datoservice.armasMunicion.length - 1; ++i) {
      probablilidades += this.datoservice.armasMunicion[i].probabilidad;
    }
    //y creamos 20 objetos en cada casa
    for (let i = 0; i <= this.datoservice.numeroDeObjetos; ++i) {
      const aleatorio = Math.floor(Math.random() * probablilidades);

      sumatorio = 0;
      for (let j = 0; j <= aleatorio - 1; ++j) {
        sumatorio += this.datoservice.armasMunicion[j].probabilidad;

        if (sumatorio >= aleatorio) {
          recursos.push(this.datoservice.armasMunicion[j].arma);
          break;
        }
      }
    }
    this.datoservice.recursosCasas.push(recursos);
  }

  buscar(casa: string) {
    //la búsqueda en las casas consiste en 20 objetos, cada vez que busques
    //ese objeto desaparece, y cada vez será más dificil encontrar algo.
    const aleatorio = Math.floor(
      Math.random() * this.datoservice.numeroDeObjetos
    );

    if (this.datoservice.idenficadorCasas.length == 0) {
      this.datoservice.idenficadorCasas.push(casa);
      this.crearRecursos();
    }

    let resultadoEncontrado: boolean = false;

    for (let i = 0; i <= this.datoservice.idenficadorCasas.length; ++i) {
      if (casa === this.datoservice.idenficadorCasas[i]) {
        resultadoEncontrado = true;
        this.datoservice.armaEncontrada =
          this.datoservice.recursosCasas[i][aleatorio];
        this.datoservice.recursosCasas[i][aleatorio] = 'Nada';
        this.datoservice.recursosCasas = [...this.datoservice.recursosCasas];
      }
    }
    if (resultadoEncontrado === false) {
      this.crearRecursos();
      this.datoservice.idenficadorCasas.push(casa);
      this.buscar(casa);
    }
  }

  puerta(id: number, posicion: string) {
    if (this.datoservice.editar) {
      if (posicion === 'sup') {
        this.datoservice.mapaActual[id].puertaSup =
          !this.datoservice.mapaActual[id].puertaSup;
      }
      if (posicion === 'inf') {
        this.datoservice.mapaActual[id].puertaInf =
          !this.datoservice.mapaActual[id].puertaInf;
      }
      if (posicion === 'der') {
        this.datoservice.mapaActual[id].puertaDer =
          !this.datoservice.mapaActual[id].puertaDer;
      }

      if (posicion === 'izq') {
        this.datoservice.mapaActual[id].puertaIzq =
          !this.datoservice.mapaActual[id].puertaIzq;
      }
    } else {
      this.despejar(id);
    }
  }

  despejar(id: number) {
    const calleH: number = this.datoservice.mapaActual[id].calleH;
    const calleV: number = this.datoservice.mapaActual[id].calleV;
    const casa: string = this.datoservice.mapaActual[id].casa;
    const descarteHorizontal = [0, 8, 16, 24, 32, 40, 48, 56, 64];

    if (this.datoservice.mapaActual[id].casa === '') {
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
            !descarteHorizontal.includes(i + 1) &&
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
    } else {
      for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {
        if (this.datoservice.mapaActual[i].casa === casa) {
          this.datoservice.mapaActual[i].visible = true;
          this.datoservice.casasDespejadas.push(
            this.datoservice.mapaActual[i].casa
          );
        }
      }
    }
  }

  generarInicio() {
    //limpia todas las losetas de mostruos y pistas
    for (let i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      this.datoservice.mapaActual[i].enemigos = [];
      this.datoservice.mapaActual[i].pista = false;
    }

    //Generar enemigos iniciales repartidos, los llamaremos "rectador"
    for (let i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      if (Math.random() < 0.1) {
        // 10% chance to place an enemy
        this.datoservice.mapaActual[i].enemigos = ['rectador'];
      }
    }

    //-----------------------Generar Pistas-----------------------------
    //comprobamos qué casillas contienen casas
    let casas: number[] = [];

    for (let i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      if (this.datoservice.mapaActual[i].casa != '') {
        casas.push(i);
      }
    }
    //generamos números aleatorio entre las casas posibles

    //ARREGLAR ESTOOOOOOOOOO QUE NO SE OLVIDEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
    let pistas: number[] = [];
    let resultado: number = 0;
    for (
      var i = 8888888888888888888888888888888888888888888888888888888888888888888888888;
      pistas.length <= this.datoservice.pistasIniciales;
      'holi'
    ) {
      resultado = this.generarPistasRecursivamente(casas.length);
      if (!pistas.includes(casas[resultado])) {
        pistas.push(casas[resultado]);
      }
    }
    for (i = 0; i <= pistas.length - 1; ++i) {
      this.datoservice.mapaActual[pistas[i]].pista = true;
    }
  }
  generarPistasRecursivamente(probabilidades: number) {
    const numeroAleatorio = Math.floor(Math.random() * probabilidades);

    return numeroAleatorio;
  }

  rutaActual: number[] = [];
  editarRutas(accion: string, id: number) {
    if (accion === 'alternar') {
      this.datoservice.editar = true;
      this.datoservice.editarRutas = !this.datoservice.editarRutas;
    }

    if (accion === 'ruta') {
      this.rutaActual.push(id);
    }

    if (accion === 'aplicar') {
      this.datoservice.mapaActual[this.rutaActual[0]].rutasEnemigos =
        this.rutaActual;
      this.rutaActual = [];
    }
  }

  ronda() {
    //creamos un número aleatorio entre los enemigos posibles y sus probabilidades

    // Esto lo haré en un futuro, pero ahora sólo me voy a centrar en dos
    const enemigoAleatorio: number = Math.floor(Math.random() * 2);
    const losetaAleatorias: number = Math.floor(
      Math.random() * this.datoservice.casillasConSalidaEnemigos.length
    );

    //pasamos por todas las casillas del tablero
    for (let i = 0; i <= this.datoservice.mapaActual.length - 1; ++i) {
        //Asumimos que el jugador colocó las fichas físicamente y asumieron su control, y las borramos digitalmente
        if(this.datoservice.mapaActual[i].visible && (this.datoservice.mapaActual[i].carretera || this.datoservice.casasDespejadas.includes(this.datoservice.mapaActual[i].casa))){
          this.datoservice.mapaActual[i].pista = false;
          this.datoservice.mapaActual[i].enemigos = [];
          } 
    } 

    //pasamos por cada tipo de enemigo posible
    for (let i = 0; i <= this.datoservice.Enemigos.length - 1; ++i) {
      //por cada una de las rutas que tenga cada enemigo de ese tipo
      for (let j = 0; j <= this.datoservice.Enemigos[i].rutas.length - 1; ++j) {
        //y comprobamos cuanto avanza cada enemigo para dejar atrás y eliminar ese número de casillas
        for (let k = 0; k <= this.datoservice.Enemigos[i].avance - 1; ++k) {
          if(this.datoservice.Enemigos[i].rutas[j] != undefined){
          this.datoservice.Enemigos[i].rutas[j].shift();}
        }
        console.log('peta? ' + this.datoservice.Enemigos[i].enemigo);
        
       
    if (this.datoservice.Enemigos[i].rutas[j][0] !== undefined) {
      this.datoservice.mapaActual[
        this.datoservice.Enemigos[i].rutas[j][0]
      ].enemigos.push(this.datoservice.Enemigos[i].enemigo);
    }
      }
    }
    
    console.log('de aquí sale algo ' +
      this.datoservice.casillasConSalidaEnemigos[losetaAleatorias]
    );
    
    this.datoservice.Enemigos[enemigoAleatorio].rutas.push(
      this.datoservice.mapaActual[
        this.datoservice.casillasConSalidaEnemigos[losetaAleatorias]
      ].rutasEnemigos
          );
          this.datoservice.mapaActual[
            this.datoservice.casillasConSalidaEnemigos[losetaAleatorias]
          ].enemigos.push(this.datoservice.Enemigos[enemigoAleatorio].enemigo)
    ++this.datoservice.ronda;
  }

  guardarDatos() {
    const data = JSON.stringify(this.datoservice.mapaActual);
    localStorage.setItem(this.datoservice.nombreMapaActual, data);
  }
  cargarDatos() {


    this.datoservice.casasDespejadas = [];
    const data = localStorage.getItem(this.datoservice.nombreMapaActual);
    if (data) {
      this.datoservice.mapaActual = JSON.parse(data);
    }
    
    //añadimos los sitios posibles de donde aparencen enemigos
    this.datoservice.casillasConSalidaEnemigos = [];
    for (let i = 0; i <= this.datoservice.mapaActual.length - 1; ++i) {
      if (this.datoservice.mapaActual[i].rutasEnemigos != undefined) {
        this.datoservice.casillasConSalidaEnemigos.push(i);        
      }
    }
  }
}

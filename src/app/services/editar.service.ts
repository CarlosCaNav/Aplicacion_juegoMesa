import { Injectable } from '@angular/core';
import { DatosService } from './datos.service';
import { MapasService } from './mapas.service';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EditarService {

  constructor(public datosService: DatosService, public mapasService: MapasService) { }

    posicionEnemigosIniciales: number[] = [];


  nombreMapa: FormGroup = new FormGroup({
    nombre: new FormControl(''),
  });

  parametrosLoseta: FormGroup = new FormGroup({
    calleH: new FormControl(),
    calleV: new FormControl(),
    casa: new FormControl(''),
    enemigos: new FormControl(''),
    pista: new FormControl(false),
  });

  crearmapa() {
    this.datosService.mapaActual = [];
    for (var i = 0; i <= this.datosService.numeroLosetas; i++) {
      this.datosService.mapaActual.push({
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
    this.datosService.mapaActual[id].carretera =
      !this.datosService.mapaActual[id].carretera;
  }

  editar() {
    this.datosService.editar = !this.datosService.editar;

    // alternamos la visibilidad de todo el tablero para poderlo ver
    //para editar, u ocultarlo para jugar
    for (var i = 0; i <= this.datosService.numeroLosetas; ++i) {
      if (this.datosService.editar)
        this.datosService.mapaActual[i].visible = true;
      else {
        this.datosService.mapaActual[i].visible = false;
      }
    }

    this.generarInicio();
  }

  aplicarAutomaticamente() {
    //con esto comprobamos la visibilidad de cada loseta
    const descarteHorizontal = [0, 8, 16, 24, 32, 40, 48, 56, 64];
    var horizontal: number = 1; //horizontales impares
    var vertical: number = 2; //verticales pares
    var casa: number = 0; //C seguido de número
    var provisional: string = '';

    // Borra todos los datos
    for (var i = 0; i <= this.datosService.numeroLosetas; ++i) {
      this.datosService.mapaActual[i].casa = '';
      this.datosService.mapaActual[i].calleH = 0;
      this.datosService.mapaActual[i].calleH = 0;
    }

    //comprobamos horizontalmente si es edificio. Si lo es le aplicamos la C y un número
    // y comprobamos la siguiente. Si es también edificio se repite el número, si no se cambia
    for (var i = 0; i <= this.datosService.numeroLosetas; ++i) {
      if (this.datosService.mapaActual[i].carretera === false) {
        this.datosService.mapaActual[i].casa = 'casa' + casa;
        //si es el final de la línea, igualmente sumamos uno
        if (descarteHorizontal.includes(i + 1)) {
          casa++;
        }
      } else {
        casa++;
      }
    }
    //prepara las contiguas verticales
    for (var i = 0; i <= 7; ++i) {
      for (var j = 0; j <= 63; j += 8) {
        if (
          this.datosService.mapaActual[j + i].carretera === false &&
          provisional === ''
        ) {
          provisional = this.datosService.mapaActual[j + i].casa;
        } else if (
          this.datosService.mapaActual[j + i].carretera === false &&
          provisional != ''
        ) {
          for (var k = 0; k < this.datosService.numeroLosetas; ++k) {
            if (provisional === this.datosService.mapaActual[k].casa) {
              this.datosService.mapaActual[k].casa =
                this.datosService.mapaActual[j + i].casa;
            }
          }
          provisional = this.datosService.mapaActual[j + i].casa;
        } else {
          provisional = '';
        }
      }
      provisional = '';
    }

    // prepara las contiguas horizontales
    for (var i = 0; i <= this.datosService.numeroLosetas; ++i) {
      if (this.datosService.mapaActual[i].casa == '') {
        if (descarteHorizontal.includes(i)) {
          horizontal += 2;
        }
        this.datosService.mapaActual[i].calleH = horizontal;
      } else {
        horizontal += 2;
      }
    }
    //prepara las contiguas verticales
    for (var i = 0; i <= 7; ++i) {
      vertical += 2;
      for (var j = 0; j <= 63; j += 8) {
        if (this.datosService.mapaActual[j + i].casa == '') {
          this.datosService.mapaActual[j + i].calleV = vertical;
        } else vertical += 2;
      }
    }
  }

  crearRecursos() {
    //juntamos todas las probabliidades de búsqueda
    let probablilidades: number = 0;
    let sumatorio = 0;
    let recursos: string[] = [];

    for (let i = 0; i <= this.datosService.armasMunicion.length - 1; ++i) {
      probablilidades += this.datosService.armasMunicion[i].probabilidad;
    }
    //y creamos 20 objetos en cada casa
    for (let i = 0; i <= this.datosService.numeroDeObjetos; ++i) {
      const aleatorio = Math.floor(Math.random() * probablilidades);

      sumatorio = 0;
      for (let j = 0; j <= aleatorio - 1; ++j) {
        sumatorio += this.datosService.armasMunicion[j].probabilidad;

        if (sumatorio >= aleatorio) {
          recursos.push(this.datosService.armasMunicion[j].arma);
          break;
        }
      }
    }
    this.datosService.recursosCasas.push(recursos);
  }

  buscar(casa: string) {
    //la búsqueda en las casas consiste en 20 objetos, cada vez que busques
    //ese objeto desaparece, y cada vez será más dificil encontrar algo.
    const aleatorio = Math.floor(
      Math.random() * this.datosService.numeroDeObjetos
    );

    this.datosService.armaEncontrada = '';

    if (this.datosService.idenficadorCasas.length == 0) {
      this.datosService.idenficadorCasas.push(casa);
      this.crearRecursos();
    }

    let resultadoEncontrado: boolean = false;

    for (let i = 0; i <= this.datosService.idenficadorCasas.length; ++i) {
      if (casa === this.datosService.idenficadorCasas[i]) {
        resultadoEncontrado = true;
        this.datosService.armaEncontrada =
          this.datosService.recursosCasas[i][aleatorio];
        this.datosService.recursosCasas[i][aleatorio] = 'Nada';
        this.datosService.recursosCasas = [...this.datosService.recursosCasas];
      }
    }
    if (resultadoEncontrado === false) {
      this.crearRecursos();
      this.datosService.idenficadorCasas.push(casa);
      this.buscar(casa);
    }
    this.datosService.actualizarImagen();
    console.log(this.datosService.rutaImagen);
  }

  puerta(id: number, posicion: string) {
    if (this.datosService.editar) {
      if (posicion === 'sup') {
        this.datosService.mapaActual[id].puertaSup =
          !this.datosService.mapaActual[id].puertaSup;
      }
      if (posicion === 'inf') {
        this.datosService.mapaActual[id].puertaInf =
          !this.datosService.mapaActual[id].puertaInf;
      }
      if (posicion === 'der') {
        this.datosService.mapaActual[id].puertaDer =
          !this.datosService.mapaActual[id].puertaDer;
      }

      if (posicion === 'izq') {
        this.datosService.mapaActual[id].puertaIzq =
          !this.datosService.mapaActual[id].puertaIzq;
      }
    } else {
      this.despejar(id);
    }
  }

  despejar(id: number) {
    const calleH: number = this.datosService.mapaActual[id].calleH;
    const calleV: number = this.datosService.mapaActual[id].calleV;
    const casa: string = this.datosService.mapaActual[id].casa;
    const descarteHorizontal = [0, 8, 16, 24, 32, 40, 48, 56, 64];

    //comprobamos que no sea una casa
    if (this.datosService.mapaActual[id].casa === '') {
      for (var i = 0; i <= this.datosService.numeroLosetas; ++i) {
        if (
          this.datosService.mapaActual[i].calleH == calleH ||
          this.datosService.mapaActual[i].calleV == calleV
        ) {
          this.datosService.mapaActual[i].visible = true;

          if (i + 8 <= 63 && this.datosService.mapaActual[i + 8].casa != '') {
            this.datosService.mapaActual[i + 8].visible = true;
          }
          if (i >= 8 && this.datosService.mapaActual[i - 8].casa != '') {
            this.datosService.mapaActual[i - 8].visible = true;
          }

          if (
            i < 63 &&
            !descarteHorizontal.includes(i + 1) &&
            this.datosService.mapaActual[i + 1].casa != ''
          ) {
            this.datosService.mapaActual[i + 1].visible = true;
          }
          if (
            i > 0 &&
            !descarteHorizontal.includes(i) &&
            this.datosService.mapaActual[i - 1].casa != ''
          ) {
            this.datosService.mapaActual[i - 1].visible = true;
          }
        }
      }
      //si es una casa
    } else {
      for (var i = 0; i <= this.datosService.numeroLosetas; ++i) {
        if (this.datosService.mapaActual[i].casa === casa) {
          this.datosService.mapaActual[i].visible = true;
          this.datosService.casasDespejadas.push(
            this.datosService.mapaActual[i].casa
          );
        }
      }
    }
  }

  generarInicio() {
    //comprobamos que hay casas suficientes para las pistas
    let numeroDeCasas: number = 0;
    for (let i = 0; i <= this.datosService.numeroLosetas; ++i) {
      if (this.datosService.mapaActual[i].carretera === false) {
        numeroDeCasas++;
      }
    }

    if (numeroDeCasas <= this.datosService.pistasIniciales + 5) {
      alert('no hay losetas de casas suficientes');
    } else {
      //limpia todas las losetas de mostruos y pistas
      for (let i = 0; i <= this.datosService.numeroLosetas; ++i) {
        this.datosService.mapaActual[i].enemigos = [];
        this.datosService.mapaActual[i].pista = false;
      }

      //Generar enemigos iniciales repartidos, los llamaremos "reptador"
      for (let i = 0; i <= this.datosService.numeroLosetas; ++i) {
        if (Math.random() < this.datosService.enemigosIniciales / 100) {
          this.datosService.mapaActual[i].enemigos = ['reptador'];
          this.posicionEnemigosIniciales.push(i);
        }
      }

      //-----------------------Generar Pistas-----------------------------
      //comprobamos qué casillas contienen casas
      let casas: number[] = [];

      for (let i = 0; i <= this.datosService.numeroLosetas; ++i) {
        if (this.datosService.mapaActual[i].carretera === false) {
          casas.push(i);
        }
      }
      //generamos números aleatorio entre las casas posibles

      let pistas: number[] = [];
      while (pistas.length < this.datosService.pistasIniciales) {
        const resultado = this.generarPistasRecursivamente(casas.length);
        if (!pistas.includes(casas[resultado])) {
          pistas.push(casas[resultado]);
        }
      }
      for (let i = 0; i <= pistas.length - 1; ++i) {
        this.datosService.mapaActual[pistas[i]].pista = true;
      }
    }
  }

  generarPistasRecursivamente(probabilidades: number) {
    const numeroAleatorio = Math.floor(Math.random() * probabilidades);

    return numeroAleatorio;
  }

  rutaActual: number[] = [];
  editarRutas(accion: string, id: number) {
    if (accion === 'alternar') {
      this.datosService.editar = true;
      this.datosService.editarRutas = !this.datosService.editarRutas;
    }

    if (accion === 'ruta') {
      this.rutaActual.push(id);
    }

    if (accion === 'aplicar') {
      this.datosService.mapaActual[this.rutaActual[0]].rutasEnemigos =
        this.rutaActual;
      this.rutaActual = [];
    }

    if (accion === 'deshacer') {
      this.rutaActual = [];
    }
  }

  arrayConSalidaDeEnemigos() {
    let array: number[] = [];
    //añadimos los sitios posibles de donde aparencen enemigos
    this.datosService.casillasConSalidaEnemigos = [];
    for (let i = 0; i <= this.datosService.mapaActual.length - 1; ++i) {
      if (
        this.datosService.mapaActual[i].rutasEnemigos &&
        this.datosService.mapaActual[i].rutasEnemigos.length !== 0
      ) {
        /*  this.datosService.casillasConSalidaEnemigos.push(i)? */
        array.push(i);
      }
    }
    return array;
  }
}

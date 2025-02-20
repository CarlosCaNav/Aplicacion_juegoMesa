import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { DatosService } from '../datos.service';
import { MapasService } from '../mapas.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { get } from '@angular/fire/database';

@Component({
  selector: 'app-juego',
  imports: [NgFor, ReactiveFormsModule, NgStyle, NgIf],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css',
})
export class JuegoComponent {
  constructor(
    public datoservice: DatosService,
    public mapasService: MapasService,
    private http: HttpClient
  ) {
    this.crearmapa();
    this.obtenerClavesLocalStorage();
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      this.mostrarMapa = false
    }
  }

  /* 
      calleH: number;
      calleV: number;
      casa: string;
      visible: boolean;
      enemigo: string;
      pista: boolean */

mostrarMapa= true;
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
    for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      this.datoservice.mapaActual[i].casa = '';
      this.datoservice.mapaActual[i].calleH = 0;
      this.datoservice.mapaActual[i].calleH = 0;
    }

    //comprobamos horizontalmente si es edificio. Si lo es le aplicamos la C y un número
    // y comprobamos la siguiente. Si es también edificio se repite el número, si no se cambia
    for (var i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      if (this.datoservice.mapaActual[i].carretera === false) {
        this.datoservice.mapaActual[i].casa = 'casa' + casa;
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
          this.datoservice.mapaActual[j + i].carretera === false &&
          provisional === ''
        ) {
          provisional = this.datoservice.mapaActual[j + i].casa;
        } else if (
          this.datoservice.mapaActual[j + i].carretera === false &&
          provisional != ''
        ) {
          for (var k = 0; k < this.datoservice.numeroLosetas; ++k) {
            if (provisional === this.datoservice.mapaActual[k].casa) {
              this.datoservice.mapaActual[k].casa =
                this.datoservice.mapaActual[j + i].casa;
            }
          }
          provisional = this.datoservice.mapaActual[j + i].casa;
        } else {
          provisional = '';
        }
      }
      provisional = '';
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

    this.datoservice.armaEncontrada = '';

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
    this.datoservice.actualizarImagen();
    console.log(this.datoservice.rutaImagen);
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

    //comprobamos que no sea una casa
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
      //si es una casa
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
    //comprobamos que hay casas suficientes para las pistas
    let numeroDeCasas: number = 0;
    for (let i = 0; i <= this.datoservice.numeroLosetas; ++i) {
      if (this.datoservice.mapaActual[i].carretera === false) {
        numeroDeCasas++;
      }
    }

    if (numeroDeCasas <= this.datoservice.pistasIniciales + 5) {
      alert('no hay losetas de casas suficientes');
    } else {
      //limpia todas las losetas de mostruos y pistas
      for (let i = 0; i <= this.datoservice.numeroLosetas; ++i) {
        this.datoservice.mapaActual[i].enemigos = [];
        this.datoservice.mapaActual[i].pista = false;
      }

      //Generar enemigos iniciales repartidos, los llamaremos "reptador"
      for (let i = 0; i <= this.datoservice.numeroLosetas; ++i) {
        if (Math.random() < (this.datoservice.enemigosIniciales / 100)) {
          this.datoservice.mapaActual[i].enemigos = ['reptador'];
          this.posicionEnemigosIniciales.push(i);
        }
      }

      //-----------------------Generar Pistas-----------------------------
      //comprobamos qué casillas contienen casas
      let casas: number[] = [];

      for (let i = 0; i <= this.datoservice.numeroLosetas; ++i) {
        if (this.datoservice.mapaActual[i].carretera === false) {
          casas.push(i);
        }
      }
      //generamos números aleatorio entre las casas posibles

      let pistas: number[] = [];
      while (pistas.length < this.datoservice.pistasIniciales) {
        const resultado = this.generarPistasRecursivamente(casas.length);
        if (!pistas.includes(casas[resultado])) {
          pistas.push(casas[resultado]);
        }
      }
      for (let i = 0; i <= pistas.length - 1; ++i) {
        this.datoservice.mapaActual[pistas[i]].pista = true;
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

    if (accion === 'deshacer') {
      this.rutaActual = [];
    }
  }

  arrayConSalidaDeEnemigos() {
    let array: number[] = [];
    //añadimos los sitios posibles de donde aparencen enemigos
    this.datoservice.casillasConSalidaEnemigos = [];
    for (let i = 0; i <= this.datoservice.mapaActual.length - 1; ++i) {
      if (
        this.datoservice.mapaActual[i].rutasEnemigos &&
        this.datoservice.mapaActual[i].rutasEnemigos.length !== 0
      ) {
        /*  this.datoservice.casillasConSalidaEnemigos.push(i)? */
        array.push(i);
      }
    }
    return array;
  }

  ronda() {
    if (this.datoservice.casillasConSalidaEnemigos.length === 0) {
      this.datoservice.casillasConSalidaEnemigos =
        this.arrayConSalidaDeEnemigos();
      console.log('Casillas de inicio creadas.');
    }

    // Limpiamos el mapa
    for (let i = 0; i < this.datoservice.mapaActual.length; ++i) {
      this.datoservice.mapaActual[i].enemigos = [];
      if (
        this.datoservice.mapaActual[i].visible &&
        (this.datoservice.mapaActual[i].carretera ||
          this.datoservice.casasDespejadas.includes(
            this.datoservice.mapaActual[i].casa
          ))
      ) {
        this.datoservice.mapaActual[i].pista = false;
        this.datoservice.mapaActual[i].enemigos = [];
        // Eliminamos las rutas de los enemigos que estaban en esta casilla
        for (let j = 0; j < this.datoservice.enemigos.length; ++j) {
          for (let k = 0; k < this.datoservice.enemigos[j].rutas.length; ++k) {
            const ruta = this.datoservice.enemigos[j].rutas[k];

            /* 
            if (ruta.includes(i)) {
              // Si el enemigo tiene una ruta que pasa por esta casilla, eliminamos esa ruta
              this.datoservice.Enemigos[j].rutas.splice(k, 1);
              k--; // Ajustamos el índice porque eliminamos un elemento
            } */

            if (ruta[0] == i) {
              // Si el enemigo tiene una ruta que pasa por esta casilla, eliminamos esa ruta
              /*  this.datoservice.Enemigos[j].rutas[k].shift(); */
              this.datoservice.enemigos[j].rutas.splice(k, 1);
            }
          }
        }
      }
      //añadimos los enemigos iniciales
      else if (this.posicionEnemigosIniciales.includes(i) && this.datoservice.mapaActual[i].visible == false) {
        this.datoservice.mapaActual[i].enemigos = ['reptador'];}
    }

    // Movemos a los enemigos
    for (let i = 0; i < this.datoservice.enemigos.length; ++i) {
      for (let j = 0; j < this.datoservice.enemigos[i].rutas.length; ++j) {
        const ruta = this.datoservice.enemigos[i].rutas[j];
        if (ruta.length > 0) {
          let pasos = Math.min(
            ruta.length,
            this.datoservice.enemigos[i].avance
          );
          ruta.splice(0, pasos);

          if (ruta.length > 0) {
            this.datoservice.mapaActual[ruta[0]].enemigos.push(
              this.datoservice.enemigos[i].enemigo
            );
          }
        } else {
          this.datoservice.enemigos[i].rutas.splice(j, 1);
          j--;
        }
      }
    }
    //comprobamos si algún enemigo se mueve una casilla más
    const numeroAleatorio = Math.floor(Math.random() * 100);
    const enemigoAleatorio = Math.floor(
      Math.random() * (this.datoservice.fase + 1)
    );
    if (
      numeroAleatorio < this.datoservice.probabilidadAvanceDoble &&
      enemigoAleatorio < this.datoservice.fase + 1
    ) {
      alert(
        'Atención, avanza una casilla adicional, los enemigos "' +
          this.datoservice.enemigos[enemigoAleatorio].enemigo +
          '"'
      );
    }

    //comprobamos si hay que incrementar la fase
    switch (this.datoservice.ronda) {
      case this.datoservice.rondaPrimeraFase:
        this.datoservice.fase = 1;
        break;
      case this.datoservice.rondaSegundaFase:
        this.datoservice.fase = 2;
        break;
      case this.datoservice.rondaTerceraFase:
        this.datoservice.fase = 3;
        alert('El primigenio está despertando');
        const numeroAleatorio = Math.floor(
          Math.random() * this.datoservice.numeroLosetas
        );
        this.datoservice.mapaActual[numeroAleatorio].enemigos.push(
          'PRIMIGENIO'
        );
        this.datoservice.casillaPrimigenio = numeroAleatorio;
        if (this.datoservice.mapaActual[numeroAleatorio].visible == false) {
          {
            if (this.datoservice.pistasEncontradas >= 2) {
              this.datoservice.mapaActual[numeroAleatorio].visible = true;
            }
          }
        }
        break;
      case this.datoservice.rondaCuartaFase:
        this.datoservice.fase = 4;
        alert(
          'El primigenio ha despertado, los investigadores pierden la partida'
        );
        break;
    }

    console.log('la fase es ' + this.datoservice.fase);

    //creamos enemigos nuevos
    //creamos el primer enemigo obligatorio
    this.nuevoEnemigo();
    //comprobamos si añadimos un segundo
    if (this.datoservice.ronda > this.datoservice.mazoEnemigosSimples) {
      this.nuevoEnemigo();
    } else {
      const numeroPosibleAleatorio = Math.floor(
        Math.random() *
          (this.datoservice.mazoEnemigosSimples)
      );
      if (numeroPosibleAleatorio < this.datoservice.ronda) {
        this.nuevoEnemigo();
      }
    }

    // Incrementamos la ronda
    this.datoservice.ronda++;

    // Guardamos los datos
    this.guardadoAutomatico();
  }

  nuevoEnemigo() {
    //El enemigo aleatorio hay que cambiarlo en un futuro, ya que ahora hay sólo 4,
    // pero en el futuro puede haber diferentes enemigos en una misma fase.
    //a demás no cuenta la probabilidad de cada uno
    const enemigoAleatorio = Math.floor(
      Math.random() * (this.datoservice.fase + 1)
    );
    const losetaAleatoria = Math.floor(
      Math.random() * this.datoservice.casillasConSalidaEnemigos.length
    );

    // Añadimos un nuevo enemigo
    //Le añadimos la ruta a seguir al enemigo
    const nuevaRuta = [
      ...this.datoservice.mapaActual[
        this.datoservice.casillasConSalidaEnemigos[losetaAleatoria]
      ].rutasEnemigos,
    ];

    this.datoservice.enemigos[enemigoAleatorio].rutas.push(nuevaRuta);

    //marcamos en el mapa la ubicación del enemigo
    this.datoservice.mapaActual[
      this.datoservice.casillasConSalidaEnemigos[losetaAleatoria]
    ].enemigos.push(this.datoservice.enemigos[enemigoAleatorio].enemigo);
  }

  descargarJSON() {
    /* 
  const data = localStorage.getItem(this.datoservice.nombreMapaActual);

  if (data) {
    this.datoservice.mapaActual = JSON.parse(data);  
  }
 */

    const jsonString = localStorage.getItem(this.datoservice.nombreMapaActual);

    if (jsonString) {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', this.datoservice.nombreMapaActual);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }

  obtenerClavesLocalStorage() {
    this.datoservice.clavesLocalStorage = [];
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave !== null) {
        // Verifica si la clave no es nula
        this.datoservice.clavesLocalStorage.push(clave);
      }
    }
  }
  guardarDatos(option: string) {
    const data = JSON.stringify(this.datoservice.mapaActual);
    const name: string = this.nombreMapa.value.nombre;

    if (option === 'sobrescribir') {
      localStorage.setItem(this.datoservice.nombreMapaActual, data);
    } else if (option === 'nuevo') {
      localStorage.setItem(name, data);
    }
    this.obtenerClavesLocalStorage();
  }

  guardadoAutomatico() {
    const autoguardado = [
      this.datoservice.mapaActual,
      this.datoservice.enemigos,
      this.datoservice.ronda,
      this.datoservice.pistasEncontradas,
      this.datoservice.armaEncontrada,
      this.datoservice.casillaPrimigenio,
      this.datoservice.rutaImagen,
      this.datoservice.editar,
      this.datoservice.editarRutas,
      this.datoservice.nombreMapaActual,
      this.datoservice.casillasConSalidaEnemigos,
      this.datoservice.casasDespejadas,
      this.datoservice.recursosCasas,
      this.datoservice.idenficadorCasas,
      this.datoservice.clavesLocalStorage,
      this.datoservice.emergenteMostrado,
      this.posicionEnemigosIniciales,
    ];
    const data = JSON.stringify(autoguardado);

    localStorage.setItem('autoguardado', data);
    /*  const dataMapa = JSON.stringify(this.datoservice.mapaActual);
    const dataEnemigos = JSON.stringify(this.datoservice.enemigos);
    const nameMapa: string = 'autoguardadoMapa';
    const nameEnemigos: string = 'autoguardadoEnemigos';

    localStorage.setItem(nameMapa, dataMapa);
    localStorage.setItem(nameEnemigos, dataEnemigos); */
  }

  cargarPartidaAnterior() {
    const data = localStorage.getItem('autoguardado');
    if (data) {
      const [
        mapaActual,
        enemigos,
        ronda,
        pistasEncontradas,
        armaEncontrada,
        casillaPrimigenio,
        rutaImagen,
        editar,
        editarRutas,
        nombreMapaActual,
        casillasConSalidaEnemigos,
        casasDespejadas,
        recursosCasas,
        idenficadorCasas,
        clavesLocalStorage,
        emergenteMostrado,
        posicionEnemigosIniciales,
      ] = JSON.parse(data);

      this.datoservice.mapaActual = mapaActual;
      this.datoservice.enemigos = enemigos;
      this.datoservice.ronda = ronda;
      this.datoservice.pistasEncontradas = pistasEncontradas;
      this.datoservice.armaEncontrada = armaEncontrada;
      this.datoservice.casillaPrimigenio = casillaPrimigenio;
      this.datoservice.rutaImagen = rutaImagen;
      this.datoservice.editar = editar;
      this.datoservice.editarRutas = editarRutas;
      this.datoservice.nombreMapaActual = nombreMapaActual;
      this.datoservice.casillasConSalidaEnemigos = casillasConSalidaEnemigos;
      this.datoservice.casasDespejadas = casasDespejadas;
      this.datoservice.recursosCasas = recursosCasas;
      this.datoservice.idenficadorCasas = idenficadorCasas;
      this.datoservice.clavesLocalStorage = clavesLocalStorage;
      this.datoservice.emergenteMostrado = emergenteMostrado;
      this.posicionEnemigosIniciales = posicionEnemigosIniciales;
    } else {
      alert('No hay datos guardados');
    }
    this.mostrarMapa = true;
  }

  cargarDatos(name: string) {
    this.datoservice.casasDespejadas = [];

    this.datoservice.nombreMapaActual = name;
    const data = localStorage.getItem(name);

    if (data) {
      this.datoservice.mapaActual = JSON.parse(data);
    }
    this.nombreMapa.reset();
    this.obtenerClavesLocalStorage();
  }

  borrarDatos(mapa: string) {
    const confirmacion = confirm(
      '¿Estás seguro de que deseas eliminar los datos?'
    );

    if (confirmacion) {
      localStorage.removeItem(mapa);
      alert('Datos eliminados correctamente');
    }
    this.obtenerClavesLocalStorage();
  }

  cargarAleatorio() {
    const inicioJugadores: number = Math.floor(
      Math.random() * this.datoservice.numeroLosetas
    );

    this.datoservice.mapaActual = this.mapasService.cargarMapaAleatorio();
    setTimeout(() => {
      this.aplicarAutomaticamente();
      setTimeout(() => {
        this.editar();
        this.datoservice.mapaActual[inicioJugadores].visible = true;
      }, 1500);
      this.mostrarMapa = true;
    }, 1000);

    /* 
     this.aplicarAutomaticamente();
     this.generarInicio(); */
  }
}

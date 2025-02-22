import { Injectable } from '@angular/core';
import { DatosService } from './datos.service';
import { EditarService } from './editar.service';
import { MapasService } from './mapas.service';

@Injectable({
  providedIn: 'root',
})
export class AlmacenamientoService {
  constructor(
    public datosService: DatosService,
    public mapasService: MapasService,
    public editarService: EditarService
  ) {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      this.mostrarMapa = false;
    }
  }

  mostrarMapa = true;

  descargarJSON() {
    /* 
  const data = localStorage.getItem(this.datosService.nombreMapaActual);

  if (data) {
    this.datosService.mapaActual = JSON.parse(data);  
  }
 */

    const jsonString = localStorage.getItem(this.datosService.nombreMapaActual);

    if (jsonString) {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', this.datosService.nombreMapaActual);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }

  obtenerClavesLocalStorage() {
    this.datosService.clavesLocalStorage = [];
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave !== null) {
        // Verifica si la clave no es nula
        this.datosService.clavesLocalStorage.push(clave);
      }
    }
  }
  guardarDatos(option: string) {
    const data = JSON.stringify(this.datosService.mapaActual);
    const name: string = this.editarService.nombreMapa.value.nombre;

    if (option === 'sobrescribir') {
      localStorage.setItem(this.datosService.nombreMapaActual, data);
    } else if (option === 'nuevo') {
      localStorage.setItem(name, data);
    }
    this.obtenerClavesLocalStorage();
  }

  guardadoAutomatico() {
    const autoguardado = [
      this.datosService.mapaActual,
      this.datosService.enemigos,
      this.datosService.ronda,
      this.datosService.pistasEncontradas,
      this.datosService.armaEncontrada,
      this.datosService.casillaPrimigenio,
      this.datosService.rutaImagen,
      this.datosService.editar,
      this.datosService.editarRutas,
      this.datosService.nombreMapaActual,
      this.datosService.casillasConSalidaEnemigos,
      this.datosService.casasDespejadas,
      this.datosService.recursosCasas,
      this.datosService.idenficadorCasas,
      this.datosService.clavesLocalStorage,
      this.datosService.emergenteMostrado,
      this.editarService.posicionEnemigosIniciales,
    ];
    const data = JSON.stringify(autoguardado);

    localStorage.setItem('autoguardado', data);
    /*  const dataMapa = JSON.stringify(this.datosService.mapaActual);
    const dataEnemigos = JSON.stringify(this.datosService.enemigos);
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

      this.datosService.mapaActual = mapaActual;
      this.datosService.enemigos = enemigos;
      this.datosService.ronda = ronda;
      this.datosService.pistasEncontradas = pistasEncontradas;
      this.datosService.armaEncontrada = armaEncontrada;
      this.datosService.casillaPrimigenio = casillaPrimigenio;
      this.datosService.rutaImagen = rutaImagen;
      this.datosService.editar = editar;
      this.datosService.editarRutas = editarRutas;
      this.datosService.nombreMapaActual = nombreMapaActual;
      this.datosService.casillasConSalidaEnemigos = casillasConSalidaEnemigos;
      this.datosService.casasDespejadas = casasDespejadas;
      this.datosService.recursosCasas = recursosCasas;
      this.datosService.idenficadorCasas = idenficadorCasas;
      this.datosService.clavesLocalStorage = clavesLocalStorage;
      this.datosService.emergenteMostrado = emergenteMostrado;
      this.editarService.posicionEnemigosIniciales = posicionEnemigosIniciales;
    } else {
      alert('No hay datos guardados');
    }
    this.mostrarMapa = true;
  }

  cargarDatos(name: string) {
    this.datosService.casasDespejadas = [];

    this.datosService.nombreMapaActual = name;
    const data = localStorage.getItem(name);

    if (data) {
      this.datosService.mapaActual = JSON.parse(data);
    }
    this.editarService.nombreMapa.reset();
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

  ejecutarMapa(mapaElegido: string) {
    const inicioJugadores: number = Math.floor(
      Math.random() * this.datosService.numeroLosetas
    );
    const mapa = this.mapasService.cargarMapa(mapaElegido);
    this.mapaPrevisualizado = mapaElegido;

    if (mapa) {
      this.datosService.mapaActual = mapa;
    } else {
      console.error('Failed to load map');
    }
    if (this.datosService.emergenteMostrado != 'elegirMapa') {
      setTimeout(() => {
        this.editarService.aplicarAutomaticamente();
        setTimeout(() => {
          this.editarService.editar();
          this.datosService.mapaActual[inicioJugadores].visible = true;
        }, 1000);
        this.mostrarMapa = true;
      }, 1500);
    }

    /* 
     this.aplicarAutomaticamente();
     this.generarInicio(); */
  }
  mapaPrevisualizado: string = '';
  ejecutarPrevisualizado() {
    this.datosService.emergenteMostrado = '';
    if (this.mapaPrevisualizado != '')
      this.ejecutarMapa(this.mapaPrevisualizado);
  }
}

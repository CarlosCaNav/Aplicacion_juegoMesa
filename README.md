# Aplicación para juego de mesa (beta)

![preview](https://raw.githubusercontent.com/CarlosCaNav/Aplicacion_juegoMesa/refs/heads/master/public/readme/barner.jpg)


## Breve explicación

La aplicación para el juego de mesa tiene como objetivo desvelar el mapa y enemigos a medida que los jugadores vayan avanzando, para que el jugador no pueda saber a qué se enfrenta.

[Teaser en Youtube](https://www.youtube.com/watch?v=Sg87IhK12kE "Teaser en Youtube V1.0:")

[Funcionamiento de la aplicación.](https://youtu.be/ujvC5-ZAae8 "Teaser en Youtube V1.0:")

La aplicación consta de dos partes. Un editor de mapas provisional, que no estará disponible para el usuario final, y el guiado del juego de mesa.

Las losetas grises representan carreteras, y las naranjas el interior de las casas.

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) version 19.1.3.

## Development server

Para iniciar un servidor de desarrollo local, ejecute:

```bash
ng serve
```
Una vez que el servidor esté en funcionamiento, abra su navegador y navegue a `http://localhost:4200/`. La aplicación se recargará automáticamente al modificar cualquier archivo fuente.


## ¿Qué aporta esta Beta?

El proyecto original comenzó como una prueba para ver qué se sentía al jugar al zombicide sin conocer el mapa y despejándolo a nuestro paso. La idea nos gustó mucho y fue evolucionando hasta ser un juego completamente nuevo.

El código original fue una amalgama de ideas, improvisación y cambios inmensos hasta dar con un resultado convincente. Como resultado, el código es un espagueti impracticable.

Con el juego ya terminado y las ideas claras, decidí rehacer el proyecto por completo desde cero en una rama a parte, con la idea de tener un código más limpio, mantenible y permitiendo cambios y mejoras al juego con mayor facilidad.

### Novedades de la versión

* Ruta de enemigos - Ahora los enemigos se mueven hacia la casilla de carretera visible más cercana sin seguir una ruta preestablecida.

* Estética renovada - Apartado estético mejorado con texturas, y diferencia entre casa explorada o sin explorar (tejado o interior).

* Casillas despejables - Si una casilla puede despejar terreno, se resalta para que destaque.

* Código reescrito. Se ha reescrito por completo el proyecto.

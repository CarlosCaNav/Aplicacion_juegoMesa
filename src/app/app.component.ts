
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';
import { GameComponent } from "./components/game/game.component";
import { MenusComponent } from './components/menus/menus.component';
import { ConfigurationsService } from './services/configurations.service';
import { NgFor, NgIf } from '@angular/common';   
import { Component, inject } from '@angular/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, RouterOutlet, EditorComponent, GameComponent, MenusComponent], //esto no debería ir aquí!
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'JuegoMesa';

  private configurationsService: ConfigurationsService = inject(ConfigurationsService);

/*  page: string = this.configurationsService.returnPage(); */

 public page(): string {
  return this.configurationsService.returnPage();
}
}

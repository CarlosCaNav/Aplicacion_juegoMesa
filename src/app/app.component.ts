
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';
import { GameComponent } from "./components/game/game.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EditorComponent, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'JuegoMesa';


}

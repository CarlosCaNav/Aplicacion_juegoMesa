
import { Component, inject } from '@angular/core';
import { ConfigurationsService } from '../../services/configurations.service';
import { LoadMapService } from '../../services/load-map.service';


@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.css'
})
export class MenusComponent {

  private configurationsService: ConfigurationsService = inject(ConfigurationsService);
  private loadMapService: LoadMapService = inject(LoadMapService);
/* 
  menu: string = this.configurationsService.menu; */

  changePage(page: string) {
    this.configurationsService.changePage(page);
  }

  loadMap(map: string) {
    this.loadMapService.loadMap(map);
  }

}

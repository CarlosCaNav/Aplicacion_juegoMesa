
import { Component, inject } from '@angular/core';
import { ConfigurationsService } from '../../services/configurations.service';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.css'
})
export class MenusComponent {

  private configurationsService: ConfigurationsService = inject(ConfigurationsService);

  changePage(page: string) {
    this.configurationsService.changePage(page);
  }

}

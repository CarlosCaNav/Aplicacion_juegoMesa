import { Component, inject } from '@angular/core';
import { ConfigurationsService } from '../../services/configurations.service';


@Component({
  selector: 'app-found-object',
  standalone: true,
  imports: [],
  templateUrl: './found-object.component.html',
  styleUrl: './found-object.component.css'
})
export class FoundObjectComponent {


    private configurationsService: ConfigurationsService = inject(
      ConfigurationsService
    );
    

  foundObject(): string {
    return this.configurationsService.foundObject;
  }
}

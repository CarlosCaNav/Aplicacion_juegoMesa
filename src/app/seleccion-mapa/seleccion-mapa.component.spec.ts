import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionMapaComponent } from './seleccion-mapa.component';

describe('SeleccionMapaComponent', () => {
  let component: SeleccionMapaComponent;
  let fixture: ComponentFixture<SeleccionMapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionMapaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundObjectComponent } from './found-object.component';

describe('FoundObjectComponent', () => {
  let component: FoundObjectComponent;
  let fixture: ComponentFixture<FoundObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoundObjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { EnemiesService } from './enemies.service';

describe('EnemiesService', () => {
  let service: EnemiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnemiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

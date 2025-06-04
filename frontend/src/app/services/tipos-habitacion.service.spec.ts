import { TestBed } from '@angular/core/testing';

import { TiposHabitacionService } from './tipos-habitacion.service';

describe('TiposHabitacionService', () => {
  let service: TiposHabitacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposHabitacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

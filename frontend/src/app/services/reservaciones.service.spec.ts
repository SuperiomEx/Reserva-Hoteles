import { TestBed } from '@angular/core/testing';

import { ReservacionesService } from './reservaciones.service';

describe('ReservacionesService', () => {
  let service: ReservacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

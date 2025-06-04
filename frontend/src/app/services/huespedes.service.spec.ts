import { TestBed } from '@angular/core/testing';

import { HuespedesService } from './huespedes.service';

describe('HuespedesService', () => {
  let service: HuespedesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HuespedesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

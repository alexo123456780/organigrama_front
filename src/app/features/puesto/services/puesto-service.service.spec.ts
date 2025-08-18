import { TestBed } from '@angular/core/testing';

import { PuestoServiceService } from './puesto-service.service';

describe('PuestoServiceService', () => {
  let service: PuestoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuestoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

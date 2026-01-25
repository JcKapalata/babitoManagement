import { TestBed } from '@angular/core/testing';

import { VenteServices } from './vente-services';

describe('VenteServices', () => {
  let service: VenteServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenteServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

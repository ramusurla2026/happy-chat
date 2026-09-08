import { TestBed } from '@angular/core/testing';

import { Messagenotification } from './messagenotification';

describe('Messagenotification', () => {
  let service: Messagenotification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Messagenotification);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

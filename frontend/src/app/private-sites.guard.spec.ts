import { TestBed } from '@angular/core/testing';

import { PrivateSitesGuard } from './private-sites.guard';

describe('PrivateSitesGuard', () => {
  let guard: PrivateSitesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PrivateSitesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

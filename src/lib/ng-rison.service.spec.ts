import { TestBed } from '@angular/core/testing'

import { RisonService } from './rison.service'

describe('FooService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [RisonService] }))

  it('should be created', () => {
    const service: RisonService = TestBed.get(RisonService)
    expect(service).toBeTruthy()
  })
})

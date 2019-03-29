import { TestBed, inject } from '@angular/core/testing'

import { RisonService } from './rison.service'

const ENCODED_RISON = [
  '(a:0126,b:1)',
  '(a:0,b:foo,c:\'23skidoo\')',
  '(a:2.20,b:foo,c:\'23skidoo\')',
  '!t',
  '!f',
  '!n',
  '\'\'',
  '0',
  '1.5',
  '-3',
  'a',
  '\'abc def\'',
  '()',
  '(a:0)',
  '(id:!n,type:/common/document)',
  '!()',
  '!(!t,!f,!n,\'\')',
  '\'-h\'',
  'a-z',
  '\'wow!!\'',
  'domain.com',
  '\'user@domain.com\'',
  '\'US $10\'',
  '\'can!\'t\'',
  '\'Control-F: \u0006\'',
  '\'Unicode: \u0beb\'',
]

const DECODED_RISON = [
  { a: '0126', b: 1 },
  { a: '0', b: 'foo', c: '23skidoo' },
  { a: '2.20', b: 'foo', c: '23skidoo' },
  true,
  false,
  null,
  '',
  '0',
  1.5,
  -3,
  'a',
  'abc def',
  {},
  { a: '0' },
  { id: null, type: '/common/document' },
  [],
  [true, false, null, ''],
  '-h',
  'a-z',
  'wow!',
  'domain.com',
  'user@domain.com',
  'US $10',
  'can\'t',
  'Control-F: \u0006',
  'Unicode: ௫',
]

describe('RisonService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [RisonService] }))

  it('should be created', () => {
    const service: RisonService = TestBed.get(RisonService)
    expect(service).toBeTruthy()
  })

  describe('method tests', () => {
    describe('parse', () => {
      it('url should be parsed properly', inject([RisonService], (service: RisonService) => {
        ENCODED_RISON.forEach((encoded, index) => {
          expect(service.parse(encoded)).toEqual(DECODED_RISON[index])
        })
      }))
    })
  })
})

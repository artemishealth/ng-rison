const NOT_ID_CHAR = ' \'!:(),*@$'
const NOT_ID_START = '-0123456789'
const ID_REGULAR_EXPRESSION = '[^' + NOT_ID_START + NOT_ID_CHAR + '][^' + NOT_ID_CHAR + ']*'
export const ID_OK = new RegExp('^' + ID_REGULAR_EXPRESSION + '$')
export const NEXT_ID = new RegExp(ID_REGULAR_EXPRESSION, 'g')

export class RisonParser {
  constructor(private errorHandler: Function) {
    // copy table['-'] to each of table[i] | i <- '0'..'9':
    for (let i = 0; i <= 9; i++) {
      this.table[String(i)] = this.table['-']
    }
  }
  private readonly whitespace = ''
  private risonString: string
  private index = 0
  private message = ''

  private table = {
    '!': () => {
      const s = this.risonString
      const c = s.charAt(this.index++)
      if (!c) {
        return this.error('"!" at end of input')
      }
      const x = this.bangs[c]
      if (typeof x === 'function') {
        return x.call(null, this)
      } else if (typeof x === 'undefined') {
        return this.error('unknown literal: "!' + c + '"')
      }
      return x
    },
    '(': () => {
      const o = {}
      let c
      let count = 0
      while ((c = this.next()) !== ')') {
        if (count) {
          if (c !== ',') {
            this.error('missing \',\'')
          }
        } else if (c === ',') {
          return this.error('extra \',\'')
        } else {
          --this.index
        }
        const k = this.readValue()
        if (typeof k === 'undefined') {
          return undefined
        }
        if (this.next() !== ':') {
          return this.error('missing \':\'')
        }
        const v = this.readValue()
        if (typeof v === 'undefined') {
          return undefined
        }
        o[k] = v
        count++
      }
      return o
    },
    '\'': () => {
      const s = this.risonString
      let i = this.index
      let start = i
      // tslint:disable-next-line: no-any
      const segments: any[] = []
      let c
      while ((c = s.charAt(i++)) !== '\'') {
        // if (i == s.length) return this.error('unmatched "\'"');
        if (!c) {
          return this.error('unmatched "\'"')
        }
        if (c === '!') {
          if (start < i - 1) {
            segments.push(s.slice(start, i - 1))
          }
          c = s.charAt(i++)
          if ('!\''.indexOf(c) >= 0) {
            segments.push(c)
          } else {
            return this.error('invalid string escape: "!' + c + '"')
          }
          start = i
        }
      }
      if (start < i - 1) {
        segments.push(s.slice(start, i - 1))
      }
      this.index = i
      return segments.length === 1 ? segments[0] : segments.join('')
    },
    // Also any digit.  The statement that follows this table
    // definition fills in the digits.
    '-': () => {
      let s = this.risonString
      let i = this.index
      const start = i - 1
      let state = 'int'
      let permittedSigns = '-'
      const transitions = {
        'int+.': 'frac',
        'int+e': 'exp',
        'frac+e': 'exp',
      }
      do {
        const c = s.charAt(i++)
        if (!c) {
          break
        }
        if ('0' <= c && c <= '9') {
          continue
        }
        if (permittedSigns.indexOf(c) >= 0) {
          permittedSigns = ''
          continue
        }
        state = transitions[state + '+' + c.toLowerCase()]
        if (state === 'exp') {
          permittedSigns = '-'
        }
      } while (state)
      this.index = --i
      s = s.slice(start, i)
      if (s === '-') {
        return this.error('invalid number')
      }
      if (this.leadingOrTrailingZero(s)) {
        return s
      } else {
        return Number(s)
      }
    },
  }

  private bangs = {
    t: true,
    f: false,
    n: null,
    '(': this.parseArray,
  }

  public parse(risonString: string) {
    this.risonString = risonString
    let value = this.readValue()
    if (!this.message && this.next()) {
      value = this.error('unable to parse string as rison: \'' + risonString + '\'')
    }
    if (this.message && this.errorHandler) {
      this.errorHandler(this.message, this.index)
    }
    return value
  }

  private readValue() {
    const character = this.next()
    const parseFn = character && this.table[character]

    if (parseFn) {
      return parseFn.apply(this)
    }

    // fell through table, parse as an id

    const s = this.risonString
    const i = this.index - 1

    // Regexp.lastIndex may not work right in IE before 5.5?
    // g flag on the regexp is also necessary
    NEXT_ID.lastIndex = i
    const m = NEXT_ID.exec(s)

    // console.log('matched id', i, r.lastIndex);

    if (m && m.length > 0) {
      const id = m[0]
      this.index = i + id.length
      return id // a string
    }

    if (character) {
      return this.error('invalid character: \'' + character + '\'')
    }
    return this.error('empty expression')
  }

  private next() {
    let character: string
    let ind = this.index
    do {
      if (this.index === this.risonString.length) {
        return undefined
      }
      character = this.risonString.charAt(ind++)
    } while (this.whitespace.indexOf(character) >= 0)
    this.index = ind
    return character
  }

  private error(message: string) {
    console.error('Rison parser error: ', message)
    this.message = message
    return undefined
  }

  private parseArray(parser: RisonParser) {
    // tslint:disable-next-line: no-any
    const ar: any[] = []
    let c
    while ((c = parser.next()) !== ')') {
      if (!c) {
        return parser.error('unmatched \'!(\'')
      }
      if (ar.length) {
        if (c !== ',') {
          parser.error('missing \',\'')
        }
      } else if (c === ',') {
        return parser.error('extra \',\'')
      } else {
        --parser.index
      }
      const n = parser.readValue()
      if (typeof n === 'undefined') {
        return undefined
      }
      ar.push(n)
    }
    return ar
  }

  private leadingOrTrailingZero = (value: string) => {
    return value.substring(0, 1) === '0' || value.substring(value.length - 1) === '0'
  }
}

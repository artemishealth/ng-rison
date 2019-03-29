import { UTILS } from './utils'

export class RisonStringifier {
  // url-ok but quoted in strings
  private sq = { '\'': true, '!': true }

  private stringMap = {
    array: (arr: any[]) => {
      const stringParts = arr.map(rawValue => {
        const fn = this.stringMap[typeof rawValue]
        if (fn) {
          return fn(rawValue)
        }
      })
      return `!(${stringParts.join(',')})`
    },
    boolean: (bool: boolean) => (bool ? '!t' : '!f'),
    null: (n: null) => '!n',
    number: (num: number) => {
      if (!isFinite(num)) {
        return '!n'
      }
      // strip '+' out of exponent, '-' is ok though
      return String(num).replace(/\+/, '')
    },
    object: (obj: any) => {
      if (obj) {
        if (obj instanceof Array) {
          return this.stringMap.array(obj)
        }

        if (typeof obj.__prototype__ === 'object' && typeof obj.__prototype__.encode_rison !== 'undefined') {
          return obj.encode_rison()
        }

        const keys = Object.keys(obj)
        keys.sort()
        const stringParts = keys.map(key => {
          const rawValue = obj[key]
          const fn = this.stringMap[typeof rawValue]
          return `${this.stringMap.string(key)}:${fn(rawValue)}`
        })
        return `(${stringParts.join(',')})`
      }
      return '!n'
    },
    string: (str: string) => {
      if (str === '') {
        return `''`
      }

      if (!isNaN((str as unknown) as number) && UTILS.LEADING_OR_TRAILING_ZERO(str)) {
        return str
      }

      if (UTILS.ID_OK.test(str)) {
        return str
      }

      const formattedString = str.replace(/(['!])/g, (a, b) => {
        if (this.sq[b]) {
          return '!' + b
        }
        return b
      })

      return `'${formattedString}'`
    },
    undefined: x => {
      throw new Error('rison can\'t encode the undefined value')
    },
  }

  public stringify(obj: any): string {
    return this.stringMap[typeof obj](obj)
  }
}

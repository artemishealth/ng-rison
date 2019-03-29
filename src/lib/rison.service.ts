import { Injectable } from '@angular/core'
import { RisonParser } from './rison-parser'

@Injectable()
export class RisonService {
  private readonly notIdChar = ' \'!:(),*@$'
  private readonly notIdStart = '-0123456789'
  private readonly idRegularExpression = '[^' + this.notIdStart + this.notIdChar + '][^' + this.notIdChar + ']*'
  private readonly idOk = new RegExp('^' + this.idRegularExpression + '$')
  private readonly nextId = new RegExp(this.idRegularExpression, 'g')
  private sq = {
    '\'': true,
    '!': true,
  }

  // tslint:disable-next-line: no-any
  public stringify(obj: any): string {
    return ''
    // return ID_REGULAR_EXPRESSION
  }

  // tslint:disable-next-line: no-any
  public parse(url: string): any {
    const errorCb = (e: Error) => {
      throw Error('rison decoder error: ' + e)
    }
    const parser = new RisonParser(errorCb)
    return parser.parse(url)
  }
}

import { Injectable } from '@angular/core'
import { RisonParser } from './rison-parser'
import { RisonStringifier } from './rison-stringifier'

@Injectable()
export class RisonService {
  /**
   * This method Rison-encodes a javascript structure.
   */
  public stringify(obj: any): string {
    return new RisonStringifier().stringify(obj)
  }

  /**
   * This method parses a rison string into a javascript object or primitive
   */
  public parse(url: string): any {
    const errorCb = (e: Error) => {
      throw Error('rison decoder error: ' + e)
    }
    const parser = new RisonParser(errorCb)
    return parser.parse(url)
  }
}

const NOT_ID_CHAR = ' \'!:(),*@$'
const NOT_ID_START = '-0123456789'
const ID_REGULAR_EXPRESSION = '[^' + NOT_ID_START + NOT_ID_CHAR + '][^' + NOT_ID_CHAR + ']*'

export const UTILS = {
  ID_OK: new RegExp('^' + ID_REGULAR_EXPRESSION + '$'),
  NEXT_ID: new RegExp(ID_REGULAR_EXPRESSION, 'g'),
  LEADING_OR_TRAILING_ZERO: (value: string) => {
    return value.substring(0, 1) === '0' || value.substring(value.length - 1) === '0'
  },
}

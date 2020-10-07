(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) :
    (global = global || self, factory((global.zef = global.zef || {}, global.zef.ngRison = {}), global.ng.core));
}(this, function (exports, core) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/utils.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    const NOT_ID_CHAR = ' \'!:(),*@$';
    /** @type {?} */
    const NOT_ID_START = '-0123456789';
    /** @type {?} */
    const ID_REGULAR_EXPRESSION = '[^' + NOT_ID_START + NOT_ID_CHAR + '][^' + NOT_ID_CHAR + ']*';
    const ɵ0 = /**
     * @param {?} value
     * @return {?}
     */
    (value) => {
        return value.substring(0, 1) === '0' || value.substring(value.length - 1) === '0';
    };
    /** @type {?} */
    const UTILS = {
        ID_OK: new RegExp('^' + ID_REGULAR_EXPRESSION + '$'),
        NEXT_ID: new RegExp(ID_REGULAR_EXPRESSION, 'g'),
        LEADING_OR_TRAILING_ZERO: (ɵ0),
    };

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/rison-parser.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    class RisonParser {
        /**
         * @param {?} errorHandler
         */
        constructor(errorHandler) {
            this.errorHandler = errorHandler;
            this.whitespace = '';
            this.index = 0;
            this.message = '';
            this.table = {
                '!': (/**
                 * @return {?}
                 */
                () => {
                    /** @type {?} */
                    const s = this.risonString;
                    /** @type {?} */
                    const c = s.charAt(this.index++);
                    if (!c) {
                        return this.error('"!" at end of input');
                    }
                    /** @type {?} */
                    const x = this.bangs[c];
                    if (typeof x === 'function') {
                        return x.call(null, this);
                    }
                    else if (typeof x === 'undefined') {
                        return this.error('unknown literal: "!' + c + '"');
                    }
                    return x;
                }),
                '(': (/**
                 * @return {?}
                 */
                () => {
                    /** @type {?} */
                    const o = {};
                    /** @type {?} */
                    let c;
                    /** @type {?} */
                    let count = 0;
                    while ((c = this.next()) !== ')') {
                        if (count) {
                            if (c !== ',') {
                                this.error('missing \',\'');
                            }
                        }
                        else if (c === ',') {
                            return this.error('extra \',\'');
                        }
                        else {
                            --this.index;
                        }
                        /** @type {?} */
                        const k = this.readValue();
                        if (typeof k === 'undefined') {
                            return undefined;
                        }
                        if (this.next() !== ':') {
                            return this.error('missing \':\'');
                        }
                        /** @type {?} */
                        const v = this.readValue();
                        if (typeof v === 'undefined') {
                            return undefined;
                        }
                        o[k] = v;
                        count++;
                    }
                    return o;
                }),
                '\'': (/**
                 * @return {?}
                 */
                () => {
                    /** @type {?} */
                    const s = this.risonString;
                    /** @type {?} */
                    let i = this.index;
                    /** @type {?} */
                    let start = i
                    // tslint:disable-next-line: no-any
                    ;
                    // tslint:disable-next-line: no-any
                    /** @type {?} */
                    const segments = [];
                    /** @type {?} */
                    let c;
                    while ((c = s.charAt(i++)) !== '\'') {
                        // if (i == s.length) return this.error('unmatched "\'"');
                        if (!c) {
                            return this.error('unmatched "\'"');
                        }
                        if (c === '!') {
                            if (start < i - 1) {
                                segments.push(s.slice(start, i - 1));
                            }
                            c = s.charAt(i++);
                            if ('!\''.indexOf(c) >= 0) {
                                segments.push(c);
                            }
                            else {
                                return this.error('invalid string escape: "!' + c + '"');
                            }
                            start = i;
                        }
                    }
                    if (start < i - 1) {
                        segments.push(s.slice(start, i - 1));
                    }
                    this.index = i;
                    return segments.length === 1 ? segments[0] : segments.join('');
                }),
                // Also any digit.  The statement that follows this table
                // definition fills in the digits.
                '-': (/**
                 * @return {?}
                 */
                () => {
                    /** @type {?} */
                    let s = this.risonString;
                    /** @type {?} */
                    let i = this.index;
                    /** @type {?} */
                    const start = i - 1;
                    /** @type {?} */
                    let state = 'int';
                    /** @type {?} */
                    let permittedSigns = '-';
                    /** @type {?} */
                    const transitions = {
                        'int+.': 'frac',
                        'int+e': 'exp',
                        'frac+e': 'exp',
                    };
                    do {
                        /** @type {?} */
                        const c = s.charAt(i++);
                        if (!c) {
                            break;
                        }
                        if ('0' <= c && c <= '9') {
                            continue;
                        }
                        if (permittedSigns.indexOf(c) >= 0) {
                            permittedSigns = '';
                            continue;
                        }
                        state = transitions[state + '+' + c.toLowerCase()];
                        if (state === 'exp') {
                            permittedSigns = '-';
                        }
                    } while (state);
                    this.index = --i;
                    s = s.slice(start, i);
                    if (s === '-') {
                        return this.error('invalid number');
                    }
                    if (UTILS.LEADING_OR_TRAILING_ZERO(s)) {
                        return s;
                    }
                    else {
                        return Number(s);
                    }
                }),
            };
            this.bangs = {
                t: true,
                f: false,
                n: null,
                '(': this.parseArray,
            };
            // copy table['-'] to each of table[i] | i <- '0'..'9':
            for (let i = 0; i <= 9; i++) {
                this.table[String(i)] = this.table['-'];
            }
        }
        /**
         * @param {?} risonString
         * @return {?}
         */
        parse(risonString) {
            this.risonString = risonString;
            /** @type {?} */
            let value = this.readValue();
            if (!this.message && this.next()) {
                value = this.error('unable to parse string as rison: \'' + risonString + '\'');
            }
            if (this.message && this.errorHandler) {
                this.errorHandler(this.message, this.index);
            }
            return value;
        }
        /**
         * @private
         * @return {?}
         */
        readValue() {
            /** @type {?} */
            const character = this.next();
            /** @type {?} */
            const parseFn = character && this.table[character];
            if (parseFn) {
                return parseFn.apply(this);
            }
            // fell through table, parse as an id
            /** @type {?} */
            const s = this.risonString;
            /** @type {?} */
            const i = this.index - 1
            // Regexp.lastIndex may not work right in IE before 5.5?
            // g flag on the regexp is also necessary
            ;
            // Regexp.lastIndex may not work right in IE before 5.5?
            // g flag on the regexp is also necessary
            UTILS.NEXT_ID.lastIndex = i;
            /** @type {?} */
            const m = UTILS.NEXT_ID.exec(s)
            // console.log('matched id', i, r.lastIndex);
            ;
            // console.log('matched id', i, r.lastIndex);
            if (m && m.length > 0) {
                /** @type {?} */
                const id = m[0];
                this.index = i + id.length;
                return id; // a string
            }
            if (character) {
                return this.error('invalid character: \'' + character + '\'');
            }
            return this.error('empty expression');
        }
        /**
         * @private
         * @return {?}
         */
        next() {
            /** @type {?} */
            let character;
            /** @type {?} */
            let ind = this.index;
            do {
                if (this.index === this.risonString.length) {
                    return undefined;
                }
                character = this.risonString.charAt(ind++);
            } while (this.whitespace.indexOf(character) >= 0);
            this.index = ind;
            return character;
        }
        /**
         * @private
         * @param {?} message
         * @return {?}
         */
        error(message) {
            console.error('Rison parser error: ', message);
            this.message = message;
            return undefined;
        }
        /**
         * @private
         * @param {?} parser
         * @return {?}
         */
        parseArray(parser) {
            // tslint:disable-next-line: no-any
            /** @type {?} */
            const ar = [];
            /** @type {?} */
            let c;
            while ((c = parser.next()) !== ')') {
                if (!c) {
                    return parser.error('unmatched \'!(\'');
                }
                if (ar.length) {
                    if (c !== ',') {
                        parser.error('missing \',\'');
                    }
                }
                else if (c === ',') {
                    return parser.error('extra \',\'');
                }
                else {
                    --parser.index;
                }
                /** @type {?} */
                const n = parser.readValue();
                if (typeof n === 'undefined') {
                    return undefined;
                }
                ar.push(n);
            }
            return ar;
        }
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/rison-stringifier.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    class RisonStringifier {
        constructor() {
            // url-ok but quoted in strings
            this.sq = { '\'': true, '!': true };
            this.stringMap = {
                array: (/**
                 * @param {?} arr
                 * @return {?}
                 */
                (arr) => {
                    /** @type {?} */
                    const stringParts = arr.map((/**
                     * @param {?} rawValue
                     * @return {?}
                     */
                    rawValue => {
                        /** @type {?} */
                        const fn = this.stringMap[typeof rawValue];
                        if (fn) {
                            return fn(rawValue);
                        }
                    }));
                    return `!(${stringParts.join(',')})`;
                }),
                boolean: (/**
                 * @param {?} bool
                 * @return {?}
                 */
                (bool) => (bool ? '!t' : '!f')),
                null: (/**
                 * @param {?} n
                 * @return {?}
                 */
                (n) => '!n'),
                number: (/**
                 * @param {?} num
                 * @return {?}
                 */
                (num) => {
                    if (!isFinite(num)) {
                        return '!n';
                    }
                    // strip '+' out of exponent, '-' is ok though
                    return String(num).replace(/\+/, '');
                }),
                object: (/**
                 * @param {?} obj
                 * @return {?}
                 */
                (obj) => {
                    if (obj) {
                        if (obj instanceof Array) {
                            return this.stringMap.array(obj);
                        }
                        if (typeof obj.__prototype__ === 'object' && typeof obj.__prototype__.encode_rison !== 'undefined') {
                            return obj.encode_rison();
                        }
                        /** @type {?} */
                        const keys = Object.keys(obj);
                        keys.sort();
                        /** @type {?} */
                        const stringParts = keys.map((/**
                         * @param {?} key
                         * @return {?}
                         */
                        key => {
                            /** @type {?} */
                            const rawValue = obj[key];
                            /** @type {?} */
                            const fn = this.stringMap[typeof rawValue];
                            return `${this.stringMap.string(key)}:${fn(rawValue)}`;
                        }));
                        return `(${stringParts.join(',')})`;
                    }
                    return '!n';
                }),
                string: (/**
                 * @param {?} str
                 * @return {?}
                 */
                (str) => {
                    if (str === '') {
                        return `''`;
                    }
                    if (!isNaN((/** @type {?} */ (((/** @type {?} */ (str)))))) && UTILS.LEADING_OR_TRAILING_ZERO(str)) {
                        return str;
                    }
                    if (UTILS.ID_OK.test(str)) {
                        return str;
                    }
                    /** @type {?} */
                    const formattedString = str.replace(/(['!])/g, (/**
                     * @param {?} a
                     * @param {?} b
                     * @return {?}
                     */
                    (a, b) => {
                        if (this.sq[b]) {
                            return '!' + b;
                        }
                        return b;
                    }));
                    return `'${formattedString}'`;
                }),
                undefined: (/**
                 * @param {?} x
                 * @return {?}
                 */
                x => {
                    throw new Error('rison can\'t encode the undefined value');
                }),
            };
        }
        /**
         * @param {?} obj
         * @return {?}
         */
        stringify(obj) {
            return this.stringMap[typeof obj](obj);
        }
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/rison.service.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    class RisonService {
        /**
         * This method Rison-encodes a javascript structure.
         * @param {?} obj
         * @return {?}
         */
        stringify(obj) {
            return new RisonStringifier().stringify(obj);
        }
        /**
         * This method parses a rison string into a javascript object or primitive
         * @param {?} url
         * @return {?}
         */
        parse(url) {
            /** @type {?} */
            const errorCb = (/**
             * @param {?} e
             * @return {?}
             */
            (e) => {
                throw Error('rison decoder error: ' + e);
            });
            /** @type {?} */
            const parser = new RisonParser(errorCb);
            return parser.parse(url);
        }
    }
    RisonService.decorators = [
        { type: core.Injectable }
    ];

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/ng-rison.module.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    class NgRisonModule {
    }
    NgRisonModule.decorators = [
        { type: core.NgModule, args: [{
                    providers: [RisonService],
                },] }
    ];

    exports.NgRisonModule = NgRisonModule;
    exports.RisonParser = RisonParser;
    exports.RisonService = RisonService;
    exports.RisonStringifier = RisonStringifier;
    exports.UTILS = UTILS;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ng-rison.umd.js.map

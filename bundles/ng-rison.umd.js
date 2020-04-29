(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) :
    (global = global || self, factory((global.zef = global.zef || {}, global.zef.ngRison = {}), global.ng.core));
}(this, (function (exports, core) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var NOT_ID_CHAR = ' \'!:(),*@$';
    /** @type {?} */
    var NOT_ID_START = '-0123456789';
    /** @type {?} */
    var ID_REGULAR_EXPRESSION = '[^' + NOT_ID_START + NOT_ID_CHAR + '][^' + NOT_ID_CHAR + ']*';
    var ɵ0 = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return value.substring(0, 1) === '0' || value.substring(value.length - 1) === '0';
    };
    /** @type {?} */
    var UTILS = {
        ID_OK: new RegExp('^' + ID_REGULAR_EXPRESSION + '$'),
        NEXT_ID: new RegExp(ID_REGULAR_EXPRESSION, 'g'),
        LEADING_OR_TRAILING_ZERO: (ɵ0),
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var RisonParser = /** @class */ (function () {
        function RisonParser(errorHandler) {
            var _this = this;
            this.errorHandler = errorHandler;
            this.whitespace = '';
            this.index = 0;
            this.message = '';
            this.table = {
                '!': (/**
                 * @return {?}
                 */
                function () {
                    /** @type {?} */
                    var s = _this.risonString;
                    /** @type {?} */
                    var c = s.charAt(_this.index++);
                    if (!c) {
                        return _this.error('"!" at end of input');
                    }
                    /** @type {?} */
                    var x = _this.bangs[c];
                    if (typeof x === 'function') {
                        return x.call(null, _this);
                    }
                    else if (typeof x === 'undefined') {
                        return _this.error('unknown literal: "!' + c + '"');
                    }
                    return x;
                }),
                '(': (/**
                 * @return {?}
                 */
                function () {
                    /** @type {?} */
                    var o = {};
                    /** @type {?} */
                    var c;
                    /** @type {?} */
                    var count = 0;
                    while ((c = _this.next()) !== ')') {
                        if (count) {
                            if (c !== ',') {
                                _this.error('missing \',\'');
                            }
                        }
                        else if (c === ',') {
                            return _this.error('extra \',\'');
                        }
                        else {
                            --_this.index;
                        }
                        /** @type {?} */
                        var k = _this.readValue();
                        if (typeof k === 'undefined') {
                            return undefined;
                        }
                        if (_this.next() !== ':') {
                            return _this.error('missing \':\'');
                        }
                        /** @type {?} */
                        var v = _this.readValue();
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
                function () {
                    /** @type {?} */
                    var s = _this.risonString;
                    /** @type {?} */
                    var i = _this.index;
                    /** @type {?} */
                    var start = i
                    // tslint:disable-next-line: no-any
                    ;
                    // tslint:disable-next-line: no-any
                    /** @type {?} */
                    var segments = [];
                    /** @type {?} */
                    var c;
                    while ((c = s.charAt(i++)) !== '\'') {
                        // if (i == s.length) return this.error('unmatched "\'"');
                        if (!c) {
                            return _this.error('unmatched "\'"');
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
                                return _this.error('invalid string escape: "!' + c + '"');
                            }
                            start = i;
                        }
                    }
                    if (start < i - 1) {
                        segments.push(s.slice(start, i - 1));
                    }
                    _this.index = i;
                    return segments.length === 1 ? segments[0] : segments.join('');
                }),
                // Also any digit.  The statement that follows this table
                // definition fills in the digits.
                '-': (/**
                 * @return {?}
                 */
                function () {
                    /** @type {?} */
                    var s = _this.risonString;
                    /** @type {?} */
                    var i = _this.index;
                    /** @type {?} */
                    var start = i - 1;
                    /** @type {?} */
                    var state = 'int';
                    /** @type {?} */
                    var permittedSigns = '-';
                    /** @type {?} */
                    var transitions = {
                        'int+.': 'frac',
                        'int+e': 'exp',
                        'frac+e': 'exp',
                    };
                    do {
                        /** @type {?} */
                        var c = s.charAt(i++);
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
                    _this.index = --i;
                    s = s.slice(start, i);
                    if (s === '-') {
                        return _this.error('invalid number');
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
            for (var i = 0; i <= 9; i++) {
                this.table[String(i)] = this.table['-'];
            }
        }
        /**
         * @param {?} risonString
         * @return {?}
         */
        RisonParser.prototype.parse = /**
         * @param {?} risonString
         * @return {?}
         */
        function (risonString) {
            this.risonString = risonString;
            /** @type {?} */
            var value = this.readValue();
            if (!this.message && this.next()) {
                value = this.error('unable to parse string as rison: \'' + risonString + '\'');
            }
            if (this.message && this.errorHandler) {
                this.errorHandler(this.message, this.index);
            }
            return value;
        };
        /**
         * @private
         * @return {?}
         */
        RisonParser.prototype.readValue = /**
         * @private
         * @return {?}
         */
        function () {
            /** @type {?} */
            var character = this.next();
            /** @type {?} */
            var parseFn = character && this.table[character];
            if (parseFn) {
                return parseFn.apply(this);
            }
            // fell through table, parse as an id
            /** @type {?} */
            var s = this.risonString;
            /** @type {?} */
            var i = this.index - 1
            // Regexp.lastIndex may not work right in IE before 5.5?
            // g flag on the regexp is also necessary
            ;
            // Regexp.lastIndex may not work right in IE before 5.5?
            // g flag on the regexp is also necessary
            UTILS.NEXT_ID.lastIndex = i;
            /** @type {?} */
            var m = UTILS.NEXT_ID.exec(s)
            // console.log('matched id', i, r.lastIndex);
            ;
            // console.log('matched id', i, r.lastIndex);
            if (m && m.length > 0) {
                /** @type {?} */
                var id = m[0];
                this.index = i + id.length;
                return id; // a string
            }
            if (character) {
                return this.error('invalid character: \'' + character + '\'');
            }
            return this.error('empty expression');
        };
        /**
         * @private
         * @return {?}
         */
        RisonParser.prototype.next = /**
         * @private
         * @return {?}
         */
        function () {
            /** @type {?} */
            var character;
            /** @type {?} */
            var ind = this.index;
            do {
                if (this.index === this.risonString.length) {
                    return undefined;
                }
                character = this.risonString.charAt(ind++);
            } while (this.whitespace.indexOf(character) >= 0);
            this.index = ind;
            return character;
        };
        /**
         * @private
         * @param {?} message
         * @return {?}
         */
        RisonParser.prototype.error = /**
         * @private
         * @param {?} message
         * @return {?}
         */
        function (message) {
            console.error('Rison parser error: ', message);
            this.message = message;
            return undefined;
        };
        /**
         * @private
         * @param {?} parser
         * @return {?}
         */
        RisonParser.prototype.parseArray = /**
         * @private
         * @param {?} parser
         * @return {?}
         */
        function (parser) {
            // tslint:disable-next-line: no-any
            /** @type {?} */
            var ar = [];
            /** @type {?} */
            var c;
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
                var n = parser.readValue();
                if (typeof n === 'undefined') {
                    return undefined;
                }
                ar.push(n);
            }
            return ar;
        };
        return RisonParser;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var RisonStringifier = /** @class */ (function () {
        function RisonStringifier() {
            var _this = this;
            // url-ok but quoted in strings
            this.sq = { '\'': true, '!': true };
            this.stringMap = {
                array: (/**
                 * @param {?} arr
                 * @return {?}
                 */
                function (arr) {
                    /** @type {?} */
                    var stringParts = arr.map((/**
                     * @param {?} rawValue
                     * @return {?}
                     */
                    function (rawValue) {
                        /** @type {?} */
                        var fn = _this.stringMap[typeof rawValue];
                        if (fn) {
                            return fn(rawValue);
                        }
                    }));
                    return "!(" + stringParts.join(',') + ")";
                }),
                boolean: (/**
                 * @param {?} bool
                 * @return {?}
                 */
                function (bool) { return (bool ? '!t' : '!f'); }),
                null: (/**
                 * @param {?} n
                 * @return {?}
                 */
                function (n) { return '!n'; }),
                number: (/**
                 * @param {?} num
                 * @return {?}
                 */
                function (num) {
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
                function (obj) {
                    if (obj) {
                        if (obj instanceof Array) {
                            return _this.stringMap.array(obj);
                        }
                        if (typeof obj.__prototype__ === 'object' && typeof obj.__prototype__.encode_rison !== 'undefined') {
                            return obj.encode_rison();
                        }
                        /** @type {?} */
                        var keys = Object.keys(obj);
                        keys.sort();
                        /** @type {?} */
                        var stringParts = keys.map((/**
                         * @param {?} key
                         * @return {?}
                         */
                        function (key) {
                            /** @type {?} */
                            var rawValue = obj[key];
                            /** @type {?} */
                            var fn = _this.stringMap[typeof rawValue];
                            return _this.stringMap.string(key) + ":" + fn(rawValue);
                        }));
                        return "(" + stringParts.join(',') + ")";
                    }
                    return '!n';
                }),
                string: (/**
                 * @param {?} str
                 * @return {?}
                 */
                function (str) {
                    if (str === '') {
                        return "''";
                    }
                    if (!isNaN((/** @type {?} */ (((/** @type {?} */ (str)))))) && UTILS.LEADING_OR_TRAILING_ZERO(str)) {
                        return str;
                    }
                    if (UTILS.ID_OK.test(str)) {
                        return str;
                    }
                    /** @type {?} */
                    var formattedString = str.replace(/(['!])/g, (/**
                     * @param {?} a
                     * @param {?} b
                     * @return {?}
                     */
                    function (a, b) {
                        if (_this.sq[b]) {
                            return '!' + b;
                        }
                        return b;
                    }));
                    return "'" + formattedString + "'";
                }),
                undefined: (/**
                 * @param {?} x
                 * @return {?}
                 */
                function (x) {
                    throw new Error('rison can\'t encode the undefined value');
                }),
            };
        }
        /**
         * @param {?} obj
         * @return {?}
         */
        RisonStringifier.prototype.stringify = /**
         * @param {?} obj
         * @return {?}
         */
        function (obj) {
            return this.stringMap[typeof obj](obj);
        };
        return RisonStringifier;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var RisonService = /** @class */ (function () {
        function RisonService() {
        }
        /**
         * This method Rison-encodes a javascript structure.
         */
        /**
         * This method Rison-encodes a javascript structure.
         * @param {?} obj
         * @return {?}
         */
        RisonService.prototype.stringify = /**
         * This method Rison-encodes a javascript structure.
         * @param {?} obj
         * @return {?}
         */
        function (obj) {
            return new RisonStringifier().stringify(obj);
        };
        /**
         * This method parses a rison string into a javascript object or primitive
         */
        /**
         * This method parses a rison string into a javascript object or primitive
         * @param {?} url
         * @return {?}
         */
        RisonService.prototype.parse = /**
         * This method parses a rison string into a javascript object or primitive
         * @param {?} url
         * @return {?}
         */
        function (url) {
            /** @type {?} */
            var errorCb = (/**
             * @param {?} e
             * @return {?}
             */
            function (e) {
                throw Error('rison decoder error: ' + e);
            });
            /** @type {?} */
            var parser = new RisonParser(errorCb);
            return parser.parse(url);
        };
        RisonService.decorators = [
            { type: core.Injectable }
        ];
        return RisonService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgRisonModule = /** @class */ (function () {
        function NgRisonModule() {
        }
        NgRisonModule.decorators = [
            { type: core.NgModule, args: [{
                        providers: [RisonService],
                    },] }
        ];
        return NgRisonModule;
    }());

    exports.NgRisonModule = NgRisonModule;
    exports.RisonParser = RisonParser;
    exports.RisonService = RisonService;
    exports.RisonStringifier = RisonStringifier;
    exports.UTILS = UTILS;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng-rison.umd.js.map

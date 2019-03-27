(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) :
    (global = global || self, factory((global.zef = global.zef || {}, global.zef.ngRison = {}), global.ng.core));
}(this, function (exports, core) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var RisonService = /** @class */ (function () {
        function RisonService() {
        }
        /**
         * @return {?}
         */
        RisonService.prototype.doSomething = /**
         * @return {?}
         */
        function () {
            // tslint:disable-next-line: no-console
            console.log('did something!');
        };
        RisonService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        RisonService.ctorParameters = function () { return []; };
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
    exports.RisonService = RisonService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ng-rison.umd.js.map

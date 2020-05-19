"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let CotterEnum = /** @class */ (() => {
    class CotterEnum {
    }
    CotterEnum.CotterBaseURL = "https://js.cotter.app";
    CotterEnum.DEV = false;
    CotterEnum.STAGING = false;
    CotterEnum.CotterAssetsBaseURL = CotterEnum.DEV
        ? "http://localhost:3000"
        : CotterEnum.STAGING
            ? "https://s.js.cotter.app"
            : "https://js.cotter.app";
    CotterEnum.CotterBackendURL = CotterEnum.DEV
        ? "http://localhost:1234/api/v0"
        : CotterEnum.STAGING
            ? "https://s.www.cotter.app/api/v0"
            : "https://www.cotter.app/api/v0";
    CotterEnum.DefaultUSCode = "+1";
    return CotterEnum;
})();
exports.default = CotterEnum;

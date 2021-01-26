"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var API_1 = __importDefault(require("../API"));
var helper_1 = require("../helper");
var COTTER_COMPANY_CACHE_EXPIRY_KEY = "cotter_company_cache_expiry";
var COTTER_COMPANY_CACHE_KEY = "cotter_company_info";
var CompanyHandler = /** @class */ (function () {
    function CompanyHandler() {
    }
    CompanyHandler.getInfo = function () {
        var companyInfo = localStorage.getItem(COTTER_COMPANY_CACHE_KEY);
        var expiry = Date.parse(localStorage.getItem(COTTER_COMPANY_CACHE_EXPIRY_KEY));
        if (!companyInfo || expiry - Date.now() < 0) {
            // fetch from API
            var apiKeyID = helper_1.getAPIKeyIDFromAttr();
            var spaceAPI = new API_1.default(apiKeyID);
            CompanyHandler.infoPromise = spaceAPI.getInfo().then(function (companyInfo) {
                var newExpiry = Date.now() + 10;
                localStorage.setItem(COTTER_COMPANY_CACHE_KEY, JSON.stringify(companyInfo));
                localStorage.setItem(COTTER_COMPANY_CACHE_EXPIRY_KEY, new Date(newExpiry).toString());
            });
        }
        return JSON.parse(companyInfo);
    };
    return CompanyHandler;
}());
exports.default = CompanyHandler;
//# sourceMappingURL=CompanyHandler.js.map
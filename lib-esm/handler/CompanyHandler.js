import API from "../API";
import { getAPIKeyIDFromAttr } from "../helper";
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
            var apiKeyID = getAPIKeyIDFromAttr();
            var spaceAPI = new API(apiKeyID);
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
export default CompanyHandler;
//# sourceMappingURL=CompanyHandler.js.map
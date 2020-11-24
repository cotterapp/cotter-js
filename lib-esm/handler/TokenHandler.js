var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { CotterAccessToken, CotterIDToken } from "cotter-token-js";
import API from "../API";
var REFRESH_TOKEN_NAME = "rft";
var TOKEN_FETCHING_STATES = {
    initial: 1,
    fetching: 2,
    errorRetry: 3,
    errorFatal: 4,
    ready: 5,
};
var TokenHandler = /** @class */ (function () {
    function TokenHandler() {
        this.tokenFetchingState = TOKEN_FETCHING_STATES.initial;
    }
    TokenHandler.prototype.withApiKeyID = function (apiKeyID) {
        this.apiKeyID = apiKeyID;
        return this;
    };
    TokenHandler.prototype.storeTokens = function (oauthTokens) {
        var _a;
        if (oauthTokens === null || oauthTokens === undefined) {
            throw new Error("oauthTokens are not specified (null or undefined)");
        }
        this.accessToken = oauthTokens.access_token;
        this.idToken = oauthTokens.id_token;
        this.tokenType = oauthTokens.token_type;
        try {
            (_a = window === null || window === void 0 ? void 0 : window.localStorage) === null || _a === void 0 ? void 0 : _a.setItem(REFRESH_TOKEN_NAME, oauthTokens.refresh_token);
        }
        catch (e) { }
        this.tokenFetchingState = TOKEN_FETCHING_STATES.initial;
    };
    TokenHandler.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, accessTok, resp, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accessToken = this.accessToken;
                        accessTok = null;
                        if (accessToken && accessToken.length > 0) {
                            accessTok = new CotterAccessToken(accessToken);
                        }
                        if (!(accessToken == undefined ||
                            accessTok == null ||
                            accessTok.getExpiration() < new Date().getTime() / 1000)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getTokensFromRefreshToken()];
                    case 2:
                        resp = _a.sent();
                        accessToken = resp.access_token;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        // No refresh token in cookie or some other error
                        return [2 /*return*/, null];
                    case 4:
                        this.accessToken = accessToken;
                        return [2 /*return*/, new CotterAccessToken(accessToken)];
                }
            });
        });
    };
    TokenHandler.prototype.getIDToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var idToken, idTok, resp, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        idToken = this.idToken;
                        idTok = null;
                        if (idToken && idToken.length > 0) {
                            idTok = new CotterIDToken(idToken);
                        }
                        if (!(idToken == undefined ||
                            idTok == null ||
                            idTok.getExpiration() < new Date().getTime() / 1000)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getTokensFromRefreshToken()];
                    case 2:
                        resp = _a.sent();
                        idToken = resp.id_token;
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        // No refresh token in cookie or some other error
                        return [2 /*return*/, null];
                    case 4:
                        this.idToken = idToken;
                        return [2 /*return*/, new CotterIDToken(idToken)];
                }
            });
        });
    };
    // Refresh tokens only when needed.
    TokenHandler.prototype.getTokensFromRefreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var checkTokenFetchProcess = function () {
                            switch (_this.tokenFetchingState) {
                                case TOKEN_FETCHING_STATES.initial:
                                    _this.getTokensFromRefreshTokenAPI();
                                    break;
                                case TOKEN_FETCHING_STATES.ready:
                                    if (_this.fetchTokenResp) {
                                        resolve(_this.fetchTokenResp);
                                        _this.tokenFetchingState = TOKEN_FETCHING_STATES.initial;
                                        return;
                                    }
                                    break;
                                case TOKEN_FETCHING_STATES.errorRetry:
                                    _this.tokenFetchingState = TOKEN_FETCHING_STATES.initial;
                                    reject();
                                    return;
                                case TOKEN_FETCHING_STATES.errorFatal:
                                    reject();
                                    return;
                                default:
                                    break;
                            }
                            setTimeout(checkTokenFetchProcess, 0);
                        };
                        checkTokenFetchProcess();
                    })];
            });
        });
    };
    // Returns access token
    TokenHandler.prototype.getTokensFromRefreshTokenAPI = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, api, resp, err_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.tokenFetchingState = TOKEN_FETCHING_STATES.fetching;
                        this.fetchTokenResp = null;
                        refreshToken = null;
                        try {
                            refreshToken = (_a = window === null || window === void 0 ? void 0 : window.localStorage) === null || _a === void 0 ? void 0 : _a.getItem(REFRESH_TOKEN_NAME);
                        }
                        catch (e) {
                            this.tokenFetchingState = TOKEN_FETCHING_STATES.errorFatal;
                            return [2 /*return*/];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        if (!this.apiKeyID) {
                            throw "ApiKeyID is undefined, please initialize Cotter with ApiKeyID";
                        }
                        api = new API(this.apiKeyID);
                        return [4 /*yield*/, api.getTokensFromRefreshToken(refreshToken)];
                    case 2:
                        resp = _c.sent();
                        this.storeTokens(resp);
                        this.tokenFetchingState = TOKEN_FETCHING_STATES.ready;
                        this.fetchTokenResp = resp;
                        return [2 /*return*/];
                    case 3:
                        err_3 = _c.sent();
                        if ((_b = err_3.msg) === null || _b === void 0 ? void 0 : _b.includes("not valid")) {
                            this.tokenFetchingState = TOKEN_FETCHING_STATES.errorFatal;
                        }
                        else {
                            this.tokenFetchingState = TOKEN_FETCHING_STATES.errorRetry;
                        }
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Clear all access token
    TokenHandler.prototype.removeTokens = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var api, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.accessToken = undefined;
                        this.idToken = undefined;
                        this.tokenType = undefined;
                        try {
                            (_a = window === null || window === void 0 ? void 0 : window.localStorage) === null || _a === void 0 ? void 0 : _a.removeItem(REFRESH_TOKEN_NAME);
                        }
                        catch (e) { }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        if (!this.apiKeyID) {
                            throw "ApiKeyID is undefined, please initialize Cotter with ApiKeyID";
                        }
                        api = new API(this.apiKeyID);
                        return [4 /*yield*/, api.removeRefreshToken()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _b.sent();
                        throw err_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Update tokens with a new refresh token
    TokenHandler.prototype.updateTokensWithRefreshToken = function (refreshToken) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var resp, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        (_a = window === null || window === void 0 ? void 0 : window.localStorage) === null || _a === void 0 ? void 0 : _a.setItem(REFRESH_TOKEN_NAME, refreshToken);
                        return [4 /*yield*/, this.getTokensFromRefreshToken()];
                    case 1:
                        resp = _b.sent();
                        this.accessToken = resp.access_token;
                        this.idToken = resp.id_token;
                        this.tokenType = resp.token_type;
                        return [2 /*return*/, resp];
                    case 2:
                        err_5 = _b.sent();
                        // No refresh token in cookie or some other error
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TokenHandler;
}());
export default TokenHandler;
//# sourceMappingURL=TokenHandler.js.map
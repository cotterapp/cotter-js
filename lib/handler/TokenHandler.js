"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cotter_token_js_1 = require("cotter-token-js");
var API_1 = __importDefault(require("../API"));
var REFRESH_TOKEN_NAME = "rft";
var TokenHandler = /** @class */ (function () {
    function TokenHandler() {
    }
    TokenHandler.prototype.withApiKeyID = function (apiKeyID) {
        this.apiKeyID = apiKeyID;
        return this;
    };
    TokenHandler.prototype.storeTokens = function (oauthTokens) {
        if (oauthTokens === null || oauthTokens === undefined) {
            throw new Error("oauthTokens are not specified (null or undefined)");
        }
        this.accessToken = oauthTokens.access_token;
        this.idToken = oauthTokens.id_token;
        this.tokenType = oauthTokens.token_type;
        if (window && window.localStorage) {
            window.localStorage.setItem(REFRESH_TOKEN_NAME, oauthTokens.refresh_token);
        }
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
                            accessTok = new cotter_token_js_1.CotterAccessToken(accessToken);
                        }
                        if (!(accessToken == undefined ||
                            accessTok == null ||
                            accessTok.getExpiration() < new Date().getTime() / 1000)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getTokensFromRefreshToken()];
                    case 2:
                        resp = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        // No refresh token in cookie or some other error
                        return [2 /*return*/, null];
                    case 4:
                        accessToken = resp.access_token;
                        _a.label = 5;
                    case 5:
                        this.accessToken = accessToken;
                        return [2 /*return*/, new cotter_token_js_1.CotterAccessToken(accessToken)];
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
                            idTok = new cotter_token_js_1.CotterIDToken(idToken);
                        }
                        if (!(idToken == undefined ||
                            idTok == null ||
                            idTok.getExpiration() < new Date().getTime() / 1000)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getTokensFromRefreshToken()];
                    case 2:
                        resp = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        // No refresh token in cookie or some other error
                        return [2 /*return*/, null];
                    case 4:
                        idToken = resp.id_token;
                        _a.label = 5;
                    case 5:
                        this.idToken = idToken;
                        return [2 /*return*/, new cotter_token_js_1.CotterIDToken(idToken)];
                }
            });
        });
    };
    // Returns access token
    TokenHandler.prototype.getTokensFromRefreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, api, resp, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refreshToken = null;
                        if (window && window.localStorage) {
                            refreshToken = window.localStorage.getItem(REFRESH_TOKEN_NAME);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (!this.apiKeyID) {
                            throw "ApiKeyID is undefined, please initialize Cotter with ApiKeyID";
                        }
                        api = new API_1.default(this.apiKeyID);
                        return [4 /*yield*/, api.getTokensFromRefreshToken(refreshToken)];
                    case 2:
                        resp = _a.sent();
                        this.storeTokens(resp);
                        return [2 /*return*/, resp];
                    case 3:
                        err_3 = _a.sent();
                        throw err_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Clear all access token
    TokenHandler.prototype.removeTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            var api, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.accessToken = undefined;
                        this.idToken = undefined;
                        this.tokenType = undefined;
                        if (window && window.localStorage) {
                            window.localStorage.removeItem(REFRESH_TOKEN_NAME);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (!this.apiKeyID) {
                            throw "ApiKeyID is undefined, please initialize Cotter with ApiKeyID";
                        }
                        api = new API_1.default(this.apiKeyID);
                        return [4 /*yield*/, api.removeRefreshToken()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        throw err_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return TokenHandler;
}());
exports.default = TokenHandler;
//# sourceMappingURL=TokenHandler.js.map
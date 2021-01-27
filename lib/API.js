"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var enum_1 = __importDefault(require("./enum"));
var axios_1 = __importDefault(require("axios"));
var Options_1 = require("./models/Options");
var SocialLogin_1 = __importDefault(require("./SocialLogin"));
var API = /** @class */ (function () {
    function API(apiKeyID) {
        this.apiKeyID = apiKeyID;
    }
    // refreshToken should now be stored in httpOnly cookies
    // and no longer needed to be passed in.
    API.prototype.getTokensFromRefreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var config, path, req, resp, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = {
                            headers: {
                                API_KEY_ID: this.apiKeyID,
                                "Content-type": "application/json",
                            },
                            withCredentials: true,
                        };
                        path = "/token/" + this.apiKeyID;
                        req = {
                            grant_type: "refresh_token",
                        };
                        if (refreshToken) {
                            req.refresh_token = refreshToken;
                        }
                        return [4 /*yield*/, axios_1.default.post("" + enum_1.default.BackendURL + path, req, config)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp.data];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1.response.data;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // removeRefreshToken will delete the cookie
    // since it's httpOnly, can only be removed from
    // the backend
    API.prototype.removeRefreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, path, resp, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = {
                            headers: {
                                API_KEY_ID: this.apiKeyID,
                                "Content-type": "application/json",
                            },
                            withCredentials: true,
                        };
                        path = "/token/" + this.apiKeyID;
                        return [4 /*yield*/, axios_1.default.delete("" + enum_1.default.BackendURL + path, config)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp.data];
                    case 2:
                        err_2 = _a.sent();
                        throw err_2.response.data;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // begin webauthn registration, grab options from the backend
    // regarding allowed authenticator algorithms etc.
    API.prototype.checkCredentialExist = function (identifier) {
        return __awaiter(this, void 0, void 0, function () {
            var config, path, resp, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = {
                            headers: {
                                API_KEY_ID: this.apiKeyID,
                                "Content-type": "application/json",
                            },
                            withCredentials: true,
                        };
                        path = "/webauthn/exists";
                        return [4 /*yield*/, axios_1.default.get("" + enum_1.default.BackendURL + path + "?identifier=" + encodeURIComponent(identifier), config)];
                    case 1:
                        resp = _a.sent();
                        if (resp.data &&
                            resp.data.exists !== null &&
                            resp.data.exists !== undefined) {
                            return [2 /*return*/, resp.data.exists];
                        }
                        throw resp;
                    case 2:
                        err_3 = _a.sent();
                        if (err_3.response) {
                            throw err_3.response.data;
                        }
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // begin webauthn registration, grab options from the backend
    // regarding allowed authenticator algorithms etc.
    API.prototype.beginWebAuthnRegistration = function (identifier, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var config, data, path, resp, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = {
                            headers: {
                                API_KEY_ID: this.apiKeyID,
                                "Content-type": "application/json",
                            },
                            withCredentials: true,
                        };
                        data = {
                            origin: origin,
                        };
                        path = "/webauthn/register/begin";
                        return [4 /*yield*/, axios_1.default.post("" + enum_1.default.BackendURL + path + "?identifier=" + encodeURIComponent(identifier), data, config)];
                    case 1:
                        resp = _a.sent();
                        if (resp.data && resp.data.publicKey) {
                            return [2 /*return*/, Options_1.serverToCreationOptions(resp.data.publicKey)];
                        }
                        throw resp;
                    case 2:
                        err_4 = _a.sent();
                        if (err_4.response) {
                            throw err_4.response.data;
                        }
                        throw err_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Update User's Methods by enrolling WebAuthn
    API.prototype.finishWebAuthnRegistration = function (identifier, credential, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var config, data, path, resp, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = {
                            headers: {
                                API_KEY_ID: this.apiKeyID,
                                "Content-type": "application/json",
                            },
                            withCredentials: true,
                        };
                        data = Options_1.CredentialToServerCredentialCreation(credential);
                        data = __assign(__assign({}, data), { origin: origin });
                        path = "/webauthn/register/finish";
                        return [4 /*yield*/, axios_1.default.post("" + enum_1.default.BackendURL + path + "?identifier=" + encodeURIComponent(identifier), data, config)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp.data];
                    case 2:
                        err_5 = _a.sent();
                        if (err_5.response) {
                            throw err_5.response.data;
                        }
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // begin webauthn login, grab options from the backend
    // regarding allowed authenticator algorithms etc.
    API.prototype.beginWebAuthnLogin = function (identifier, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var config, data, path, resp, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = {
                            headers: {
                                API_KEY_ID: this.apiKeyID,
                                "Content-type": "application/json",
                            },
                            withCredentials: true,
                        };
                        data = {
                            origin: origin,
                        };
                        path = "/webauthn/login/begin";
                        return [4 /*yield*/, axios_1.default.post("" + enum_1.default.BackendURL + path + "?identifier=" + encodeURIComponent(identifier), data, config)];
                    case 1:
                        resp = _a.sent();
                        if (resp.data && resp.data.publicKey) {
                            return [2 /*return*/, Options_1.serverToRequestOptions(resp.data.publicKey)];
                        }
                        throw resp;
                    case 2:
                        err_6 = _a.sent();
                        if (err_6.response) {
                            throw err_6.response.data;
                        }
                        throw err_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Validate user's webauthn credentials
    API.prototype.finishWebAuthnLogin = function (identifier, identifierType, credential, origin, publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var config, data, path, resp, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = {
                            headers: {
                                API_KEY_ID: this.apiKeyID,
                                "Content-type": "application/json",
                            },
                            withCredentials: true,
                        };
                        data = Options_1.CredentialToServerCredentialRequest(credential);
                        data = __assign(__assign({}, data), { origin: origin, public_key: publicKey, identifier_type: identifierType, device_type: "BROWSER", device_name: navigator.userAgent });
                        path = "/webauthn/login/finish";
                        return [4 /*yield*/, axios_1.default.post("" + enum_1.default.BackendURL + path + "?identifier=" + encodeURIComponent(identifier), data, config)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp.data];
                    case 2:
                        err_7 = _a.sent();
                        if (err_7.response) {
                            throw err_7.response.data;
                        }
                        throw err_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // =====================
    //      Social Login
    // =====================
    API.prototype.loginAndConnect = function (tokenID, userID, provider) {
        return __awaiter(this, void 0, void 0, function () {
            var config, data, loginStateSess, path, resp, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = {
                            headers: {
                                API_KEY_ID: this.apiKeyID,
                                "Content-type": "application/json",
                            },
                            withCredentials: true,
                        };
                        data = {
                            token_id: tokenID,
                            user_id: userID,
                            identity_provider: provider,
                        };
                        try {
                            loginStateSess = sessionStorage.getItem(SocialLogin_1.default.OAUTH_SESSION_NAME);
                            data["login_state"] = JSON.parse(atob(loginStateSess));
                        }
                        catch (e) { }
                        path = "/oauth/token/connect";
                        return [4 /*yield*/, axios_1.default.post("" + enum_1.default.BackendURL + path, data, config)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp.data];
                    case 2:
                        err_8 = _a.sent();
                        if (err_8.response) {
                            throw err_8.response.data;
                        }
                        throw err_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==============================
    //      Loader Company Info
    // ==============================
    API.prototype.getInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resp, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(enum_1.default.BackendURL + "/company/info/" + this.apiKeyID, null)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp.data];
                    case 2:
                        err_9 = _a.sent();
                        if (err_9.response) {
                            throw err_9.response.data;
                        }
                        throw err_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return API;
}());
exports.default = API;
//# sourceMappingURL=API.js.map
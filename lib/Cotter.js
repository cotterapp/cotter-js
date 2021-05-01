"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var CotterVerify_1 = __importDefault(require("./CotterVerify"));
var MagicLink_1 = __importDefault(require("./MagicLink"));
var TokenHandler_1 = __importDefault(require("./handler/TokenHandler"));
var User_1 = __importDefault(require("./models/User"));
var WebAuthn_1 = __importDefault(require("./WebAuthn"));
var UserHandler_1 = __importDefault(require("./handler/UserHandler"));
var binder_1 = require("./binder");
var SocialLogin_1 = __importDefault(require("./SocialLogin"));
var tokenHandler = new TokenHandler_1.default();
var Cotter = /** @class */ (function (_super) {
    __extends(Cotter, _super);
    // constructor can be either string or object therefore the type is any
    function Cotter(config) {
        var _this = this;
        // in this case config will definitely be the API KEY ID
        if (typeof config === typeof "") {
            config = { ApiKeyID: config, Type: "" };
        }
        config = config;
        _this = _super.call(this, config, tokenHandler.withApiKeyID(config.ApiKeyID)) || this;
        // initialize magic link
        _this.signInWithLink = _this.constructMagicLink;
        _this.signInWithWebAuthnOrLink = _this.constructMagicLinkWithWebAuthn;
        _this.signInWithOTP = _this.constructOTPVerify;
        _this.signInWithWebAuthnOrOTP = _this.constructOTPVerifyWithWebAuthn;
        // initialize token handler
        _this.tokenHandler = tokenHandler.withApiKeyID(config.ApiKeyID);
        return _this;
    }
    // withFormID specify the form ID used for customization
    Cotter.prototype.withFormID = function (formID) {
        this.config.FormID = formID;
        return this;
    };
    // constructMagicLink constructs the magic link object with optional onBegin
    Cotter.prototype.constructMagicLink = function (onBegin) {
        if (onBegin)
            this.config.OnBegin = onBegin;
        this.config.AuthenticationMethod = binder_1.AUTHENTICATION_METHOD.MAGIC_LINK;
        this.config.AuthenticationMethodName = "Magic Link";
        return new MagicLink_1.default(this.config, this.tokenHander);
    };
    Cotter.prototype.constructOTPVerify = function (onBegin) {
        if (onBegin)
            this.config.OnBegin = onBegin;
        this.config.AuthenticationMethod = binder_1.AUTHENTICATION_METHOD.OTP;
        this.config.AuthenticationMethodName = "Verification Code";
        return new CotterVerify_1.default(this.config, this.tokenHander);
    };
    // ========== WEBAUTHN ============
    Cotter.isWebAuthnAvailable = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WebAuthn_1.default.available()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // constructMagicLinkWithWebAuthn constructs the magic link to run attempt login with webauthn
    Cotter.prototype.constructMagicLinkWithWebAuthn = function (onBegin) {
        if (onBegin)
            this.config.OnBegin = onBegin;
        this.config.WebAuthnEnabled = true;
        this.config.AuthenticationMethod = binder_1.AUTHENTICATION_METHOD.MAGIC_LINK;
        this.config.AuthenticationMethodName = "Magic Link";
        return new MagicLink_1.default(this.config, this.tokenHander);
    };
    // constructOTPVerifyWithWebAuthn constructs the otp to run attempt login with webauthn
    Cotter.prototype.constructOTPVerifyWithWebAuthn = function (onBegin) {
        if (onBegin)
            this.config.OnBegin = onBegin;
        this.config.WebAuthnEnabled = true;
        this.config.AuthenticationMethod = binder_1.AUTHENTICATION_METHOD.OTP;
        this.config.AuthenticationMethodName = "Verification Code";
        return new CotterVerify_1.default(this.config, this.tokenHander);
    };
    // Register WebAuthn for a logged-in user
    Cotter.prototype.registerWebAuthn = function (identifier) {
        return __awaiter(this, void 0, void 0, function () {
            var available, web_1, web;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.config.WebAuthnEnabled = true;
                        this.config.RegisterWebAuthn = true;
                        return [4 /*yield*/, WebAuthn_1.default.available()];
                    case 1:
                        available = _a.sent();
                        if (!!available) return [3 /*break*/, 3];
                        web_1 = new WebAuthn_1.default({
                            ApiKeyID: this.config.ApiKeyID,
                            Identifier: identifier,
                            Type: "REGISTRATION",
                            ErrorDisplay: "The browser or user device doesn't support WebAuthn.",
                            RegisterWebAuthn: true,
                        }, this.tokenHander);
                        return [4 /*yield*/, web_1.show()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        web = new WebAuthn_1.default({
                            ApiKeyID: this.config.ApiKeyID,
                            Identifier: identifier,
                            Type: "REGISTRATION",
                            RegisterWebAuthn: true,
                        }, this.tokenHander);
                        return [4 /*yield*/, web.show()];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Token handling
    Cotter.prototype.logOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.tokenHandler.removeTokens()];
                    case 1:
                        _a.sent();
                        UserHandler_1.default.remove();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get User
    Cotter.prototype.getLoggedInUser = function () {
        return User_1.default.getLoggedInUser();
    };
    // Social Login
    // This should redirect to the oauth login page,
    // then redirect back to the `redirectURL` provided
    // with `error` query parameter if there's an error
    // ex. http://something.com/currentpage?error=some_error
    Cotter.prototype.connectSocialLogin = function (provider, userAccessToken, redirectURL) {
        var _a;
        var connectURL = SocialLogin_1.default.getConnectURL(provider, this.config.ApiKeyID, userAccessToken, redirectURL || ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href));
        if (window) {
            window.location.href = connectURL;
        }
    };
    return Cotter;
}(CotterVerify_1.default));
exports.default = Cotter;
//# sourceMappingURL=Cotter.js.map
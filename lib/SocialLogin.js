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
var enum_1 = __importDefault(require("./enum"));
var helper_1 = require("./helper");
var binder_1 = require("./binder");
var ModalMaker_1 = __importDefault(require("./components/ModalMaker"));
var API_1 = __importDefault(require("./API"));
var defaultSocialConnectText = {
    title: "Do you want to link these accounts?",
    subtitle: "You are logging-in with an email or phone that is already associated with an existing account",
    button: "Link",
    buttonSkip: "Cancel",
    theme: "#7d44fa",
};
var SocialLogin = /** @class */ (function () {
    function SocialLogin(config) {
        this.config = config;
        if (!this.config.SocialConnectText) {
            this.config.SocialConnectText = defaultSocialConnectText;
        }
        this.loaded = false;
        // Setup div and iframe ids
        this.cotterIframeID =
            Math.random().toString(36).substring(2, 15) +
                "cotter-socialConnect-iframe";
        this.containerID =
            Math.random().toString(36).substring(2, 15) +
                "cotter-socialConnect-container";
        this.cancelDivID = "modal-socialConnect-close-form";
        this.modalID = "modal-socialConnect";
        this.init();
    }
    SocialLogin.getAuthorizeURL = function (provider, apiKeyId, state, redirectURL, codeChallenge) {
        // Store state in session storage
        var loginState = {
            client_code_challenge: codeChallenge,
            client_redirect_url: redirectURL,
            client_state: state,
            action: binder_1.SOCIAL_LOGIN_ACTION.LOGIN,
            company_id: apiKeyId,
        };
        var loginStateSess = btoa(JSON.stringify(loginState));
        try {
            sessionStorage.setItem(SocialLogin.OAUTH_SESSION_NAME, loginStateSess);
        }
        catch (e) { }
        // Send data to backend
        provider = encodeURIComponent(provider);
        apiKeyId = encodeURIComponent(apiKeyId);
        state = encodeURIComponent(state);
        redirectURL = encodeURIComponent(redirectURL);
        codeChallenge = encodeURIComponent(codeChallenge);
        return enum_1.default.BackendURL + "/oauth/credential/login/" + provider + "?api_key_id=" + apiKeyId + "&state=" + state + "&redirect_url=" + redirectURL + "&code_challenge=" + codeChallenge;
    };
    SocialLogin.getConnectURL = function (provider, apiKeyId, accessToken, redirectURL) {
        apiKeyId = encodeURIComponent(apiKeyId);
        accessToken = encodeURIComponent(accessToken);
        redirectURL = encodeURIComponent(redirectURL);
        return enum_1.default.BackendURL + "/oauth/credential/connect/" + provider + "?api_key_id=" + apiKeyId + "&access_token=" + accessToken + "&redirect_url=" + redirectURL;
    };
    SocialLogin.prototype.init = function () {
        var url = new URL(window.location.href);
        var iframeURL = new URL(enum_1.default.JSURL + "/social_connect");
        iframeURL.search = url.search;
        iframeURL.searchParams.append("api_key", this.config.ApiKeyID);
        iframeURL.searchParams.append("domain", this.config.Domain);
        iframeURL.searchParams.append("redirect_url", this.config.RedirectURL);
        iframeURL.searchParams.append("id", this.containerID);
        this.Modal = new ModalMaker_1.default(this.modalID, this.containerID, this.cotterIframeID, this.cancelDivID, iframeURL.toString());
        var modalDiv = "\n    <div class=\"modal__overlay\" tabindex=\"-1\" id=\"" + this.cancelDivID + "\" >\n      <div id=\"modal-container\" class=\"modal__container\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"modal-socialConnect-title\">\n        <div id=\"modal-content-content\" class=\"modal-content-content modal__container-socialConnect\">\n          <div id=\"modal-content\" class=\"modal__content modal__content-socialConnect\" >\n            <div id=\"" + this.containerID + "\" class=\"modal-frame-socialConnect\"></div>\n          </div>\n        </div>\n        <div class=\"cotter-watermark\" style=\"margin-top: 10px\">\n          <div class=\"title is-6\" style=\"color: #ffffff\"> Secured by </div>\n          <img src=\"" + enum_1.default.AssetURL + "/assets/images/cotter_transparent_light.png\" class=\"cotter-logo\" style=\"width: 30px; height: 30px;\"/>\n          <div class=\"title is-6\" style=\"color: #ffffff\"> Cotter </div>\n        </div>\n      </div>\n    </div>\n    ";
        var onCloseDiv = this.cancel.bind(this);
        this.Modal.initModal(onCloseDiv, modalDiv);
        this.initEventHandler();
    };
    SocialLogin.prototype.initEventHandler = function () {
        var _this = this;
        window.addEventListener("message", function (e) {
            try {
                var data = JSON.parse(e.data);
            }
            catch (e) {
                // skip in case the data is not JSON formatted
                return;
            }
            // there are some additional messages that shouldn't be handled by this
            // listener, such as messages from https://js.stripe.com/
            if (e.origin !== enum_1.default.JSURL) {
                // skip this message
                return;
            }
            var cID = _this.containerID;
            switch (data.callbackName) {
                case cID + "FIRST_LOAD":
                    var postData = {
                        action: "CONFIG",
                        payload: {
                            socialConnectText: _this.config.SocialConnectText,
                        },
                    };
                    SocialLogin.sendPost(postData, _this.cotterIframeID);
                    break;
                case cID + "LOADED":
                    _this.loaded = true;
                    break;
                case cID + "CANCEL":
                    _this.cancel();
                    break;
                case cID + "ON_SOCIAL_LOGIN_CONNECT":
                    _this.loginAndConnect(data.payload);
                default:
                    break;
            }
        });
    };
    SocialLogin.sendPost = function (data, iframeID) {
        var ifrm = document.getElementById(iframeID);
        if (helper_1.isIFrame(ifrm) && ifrm.contentWindow) {
            ifrm.contentWindow.postMessage(JSON.stringify(data), enum_1.default.JSURL);
        }
    };
    SocialLogin.prototype.show = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.Modal.showModal();
                return [2 /*return*/, helper_1.verificationProccessPromise(this)];
            });
        });
    };
    SocialLogin.prototype.cancel = function () {
        var _a, _b;
        history.pushState({}, null, (_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) === null || _b === void 0 ? void 0 : _b.split("?")[0]);
        this.Modal.closeModal();
    };
    SocialLogin.prototype.onSuccess = function (data) {
        var _a, _b;
        history.pushState({}, null, (_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) === null || _b === void 0 ? void 0 : _b.split("?")[0]);
        this.Modal.closeModal();
        window.location.href = data === null || data === void 0 ? void 0 : data.url;
    };
    SocialLogin.prototype.onError = function (error) {
        var _a, _b;
        history.pushState({}, null, (_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) === null || _b === void 0 ? void 0 : _b.split("?")[0]);
        this.Modal.closeModal();
        this.verifyError = error;
    };
    // =====================
    //          API
    // =====================
    SocialLogin.prototype.loginAndConnect = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var api, resp, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api = new API_1.default(this.config.ApiKeyID);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, api.loginAndConnect(payload.tokenID, payload.userID, payload.provider)];
                    case 2:
                        resp = _a.sent();
                        // redirect to url
                        this.onSuccess(resp);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.onError(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SocialLogin.LOGIN_KEY = "cotter_slk"; // to save code verifier etc
    SocialLogin.OAUTH_SESSION_NAME = "oauth_sess"; // to store data that's supposed to be on the cookies from server
    return SocialLogin;
}());
exports.default = SocialLogin;
//# sourceMappingURL=SocialLogin.js.map
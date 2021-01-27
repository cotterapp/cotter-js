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
import CotterEnum from "./enum";
import { AUTHENTICATION_METHOD, IDENTIFIER_TYPE, SOCIAL_LOGIN_ACTION, } from "./binder";
import { challengeFromVerifier, generateVerifier, verificationProccessPromise, isIFrame, } from "./helper";
import UserHandler from "./handler/UserHandler";
import WebAuthn from "./WebAuthn";
import API from "./API";
import SocialLogin from "./SocialLogin";
// default container id
var cotter_DefaultContainerID = "cotter-form-container";
// key in session store for code verifier
// (used in Social Login, need to store due to redirects)
var CotterVerify = /** @class */ (function () {
    function CotterVerify(config, tokenHandler) {
        var _this = this;
        this.config = config;
        if (this.config.CotterBaseURL)
            CotterEnum.JSURL = this.config.CotterBaseURL;
        if (!this.config.AdditionalFields) {
            this.config.AdditionalFields = [];
        }
        this.config.Domain = new URL(window.location.href).origin;
        if (!this.config.CotterBackendURL) {
            this.config.CotterBackendURL = CotterEnum.BackendURL;
        }
        // storing access token
        this.tokenHander = tokenHandler;
        var newState = Math.random().toString(36).substring(2, 15);
        try {
            this.state = localStorage.getItem("COTTER_STATE");
            if (!localStorage.getItem("COTTER_STATE")) {
                this.state = newState;
                localStorage.setItem("COTTER_STATE", this.state);
            }
        }
        catch (e) {
            this.state = newState;
        }
        // SUPPORT PKCE
        this.verifier = generateVerifier();
        challengeFromVerifier(this.verifier).then(function (challenge) {
            _this.challenge = challenge;
        });
        this.loaded = false;
        this.cotterIframeID =
            Math.random().toString(36).substring(2, 15) + "cotter-signup-iframe";
        // cID is the id for the Cotter instance. this will prevent postMessage to
        // be caught by other listener on other CotterVerify instances
        this.cID =
            Math.random().toString(36).substring(2, 15) +
                (this.config.ContainerID || cotter_DefaultContainerID);
        // ========== WEBAUTHN SETUP ===========
        if (this.config.RegisterWebAuthn) {
            // this.config.RegisterWebAuthn means that the client
            // is explicitly trying to register this device for WebAuthn
            this.RegisterWebAuthn = true;
        }
        // =====================================
        window.addEventListener("message", function (e) {
            var _a;
            try {
                var data = JSON.parse(e.data);
            }
            catch (e) {
                // skip in case the data is not JSON formatted
                return;
            }
            // there are some additional messages that shouldn't be handled by this
            // listener, such as messages from https://js.stripe.com/
            if (e.origin !== CotterEnum.JSURL) {
                // skip this message
                return;
            }
            var cID = _this.cID;
            switch (data.callbackName) {
                case cID + "FIRST_LOAD":
                    var postData = {
                        action: "CONFIG",
                        payload: {
                            additionalFields: _this.config.AdditionalFields,
                            identifierField: _this.config.IdentifierField,
                            buttonText: _this.config.ButtonText,
                            buttonBackgroundColor: _this.config.ButtonBackgroundColor,
                            buttonTextColor: _this.config.ButtonTextColor,
                            errorColor: _this.config.ErrorColor,
                            buttonBorderColor: _this.config.ButtonBorderColor,
                            buttonWAText: _this.config.ButtonWAText,
                            buttonWATextSubtitle: _this.config.ButtonWATextSubtitle,
                            buttonWABackgroundColor: _this.config.ButtonWABackgroundColor,
                            buttonWABorderColor: _this.config.ButtonWABorderColor,
                            buttonWATextColor: _this.config.ButtonWATextColor,
                            buttonWALogoColor: _this.config.ButtonWALogoColor,
                            phoneChannels: _this.config.PhoneChannels,
                            countryCode: _this.config.CountryCode,
                            identifierFieldInitialValue: _this.config
                                .IdentifierFieldInitialValue,
                            identifierFieldDisabled: _this.config.IdentifierFieldDisabled,
                            skipIdentiferForm: _this.config.SkipIdentifierForm,
                            skipIdentiferFormWithValue: _this.config
                                .SkipIdentifierFormWithValue,
                            skipRedirectURL: !_this.config.RedirectURL || _this.config.SkipRedirectURL
                                ? true
                                : false,
                            captchaRequired: _this.config.CaptchaRequired,
                            styles: _this.config.Styles,
                            // for magic link
                            authRequestText: _this.config.AuthRequestText,
                            authenticationMethod: _this.config.AuthenticationMethod,
                            // for terms of service
                            termsOfServiceLink: _this.config.TermsOfServiceLink,
                            privacyPolicyLink: _this.config.PrivacyPolicyLink,
                            // For social login
                            socialLoginProviders: _this.config.SocialLoginProviders,
                        },
                    };
                    _this.handleRedirect();
                    CotterVerify.sendPost(postData, _this.cotterIframeID);
                    break;
                case cID + "LOADED":
                    _this.loaded = true;
                    break;
                case cID + "ON_SUCCESS":
                    if (_this.config.OnSuccess) {
                        _this.config.OnSuccess(data.payload);
                    }
                    _this.verifySuccess = data.payload;
                    break;
                case cID + "ON_SUBMIT_AUTHORIZATION_CODE":
                    _this.submitAuthorizationCode(data.payload, _this.verifier);
                    break;
                case cID + "ON_SOCIAL_LOGIN_REQUEST":
                    window === null || window === void 0 ? void 0 : window.sessionStorage.setItem(SocialLogin.LOGIN_KEY, btoa(JSON.stringify({
                        code_verifier: _this.verifier,
                        redirect_url: window.location.href,
                    })));
                    var url = SocialLogin.getAuthorizeURL((_a = data.payload) === null || _a === void 0 ? void 0 : _a.provider, _this.config.ApiKeyID, _this.state, window.location.href, _this.challenge);
                    // Redirect to social login
                    window.location.href = url;
                    break;
                case cID + "ON_ERROR":
                    if (_this.config.OnError) {
                        _this.config.OnError(data.payload);
                    }
                    _this.verifyError = data.payload;
                    break;
                case cID + "ON_BEGIN":
                    var continueOnBegin_1 = function () {
                        if (_this.config.AuthenticationMethod === "MAGIC_LINK" && !_this.config.CaptchaRequired && document.getElementById(_this.config.ContainerID)) {
                            var container = document.getElementById(_this.config.ContainerID);
                            var currentContainerHeight = container.offsetHeight;
                            container.style.height = Math.max(300, currentContainerHeight) + "px";
                        }
                        // OnBegin method should return the error message
                        // if there is no error, return null
                        if (!!_this.config.OnBegin) {
                            var ret = _this.config.OnBegin(data.payload);
                            Promise.resolve(ret || null)
                                .then(function (err) {
                                if (!err)
                                    _this.continue(data.payload, _this.cotterIframeID);
                                else
                                    _this.StopSubmissionWithError(err, _this.cotterIframeID);
                            })
                                .catch(function (e) {
                                console.log("The OnBegin function throws an error: ", e);
                                throw "The OnBegin function throws an error: " + e;
                            });
                        }
                        else {
                            _this.continue(data.payload, _this.cotterIframeID);
                        }
                    };
                    // Check if this identifier is allowed to continue
                    if (_this.config.FormID) {
                        var resp = fetch(CotterEnum.WorkerURL + "/screening/form?identifier=" + encodeURIComponent(data.payload.identifier) + "&form-id=" + encodeURIComponent(_this.config.FormID), {
                            method: "GET",
                            headers: {
                                API_KEY_ID: _this.config.ApiKeyID,
                                "Content-type": "application/json",
                            }
                        }).then(function (body) { return body.json(); }).then(function (data) {
                            var _a;
                            if (data.passed) {
                                continueOnBegin_1();
                                return;
                            }
                            _this.StopSubmissionWithError((_a = data.message) !== null && _a !== void 0 ? _a : "You are not allowed to use this form", _this.cotterIframeID);
                        }).catch(function (e) {
                            _this.StopSubmissionWithError("Something went wrong, we're unable to process your request", _this.cotterIframeID);
                        });
                    }
                    else {
                        continueOnBegin_1();
                    }
                    break;
                default:
                    break;
            }
        });
    }
    CotterVerify.prototype.handleRedirect = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var urlParams, challenge_id, code, state, action, auth_method, socialLoginSession, socialLogin, socialLoginb, socialLogin, challenge, idType, id, clientJSON, payload, postData;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        urlParams = new URLSearchParams(window.location.search);
                        challenge_id = urlParams.get("challenge_id");
                        code = urlParams.get("code");
                        state = urlParams.get("state");
                        action = urlParams.get("action");
                        auth_method = urlParams.get("auth_method");
                        socialLoginSession = window === null || window === void 0 ? void 0 : window.sessionStorage.getItem(SocialLogin.LOGIN_KEY);
                        // Redirect To Connect
                        if (action === SOCIAL_LOGIN_ACTION.CONNECT) {
                            socialLogin = new SocialLogin(this.config);
                            socialLogin
                                .show()
                                .then(function (resp) {
                                _this.onSuccess(resp);
                            })
                                .catch(function (err) {
                                _this.onError(err);
                            });
                        }
                        if (!((challenge_id === null || challenge_id === void 0 ? void 0 : challenge_id.length) > 0 &&
                            (code === null || code === void 0 ? void 0 : code.length) > 0 &&
                            (state === null || state === void 0 ? void 0 : state.length) > 0 &&
                            (socialLoginSession === null || socialLoginSession === void 0 ? void 0 : socialLoginSession.length) > 0)) return [3 /*break*/, 2];
                        socialLoginb = atob(socialLoginSession);
                        socialLogin = socialLoginb ? JSON.parse(socialLoginb) : {};
                        this.config.RedirectURL = socialLogin.redirect_url;
                        this.config.SkipRedirectURL = true;
                        return [4 /*yield*/, this.submitAuthorizationCode({
                                authorization_code: code,
                                challenge_id: challenge_id,
                                state: state,
                                client_json: {},
                            }, socialLogin.code_verifier, socialLogin.redirect_url, auth_method)];
                    case 1:
                        _c.sent();
                        window === null || window === void 0 ? void 0 : window.sessionStorage.removeItem(SocialLogin.LOGIN_KEY);
                        history.pushState({}, null, (_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) === null || _b === void 0 ? void 0 : _b.split("?")[0]);
                        _c.label = 2;
                    case 2:
                        if (auth_method === AUTHENTICATION_METHOD.MAGIC_LINK) {
                            challenge = urlParams.get("challenge");
                            idType = urlParams.get("id_type");
                            id = urlParams.get("id");
                            clientJSON = urlParams.get("client_json");
                            this.config.SkipRedirectURL = true;
                            payload = {
                                challenge: challenge,
                                challenge_id: challenge_id,
                                client_json: JSON.parse(clientJSON),
                                identifierType: idType,
                                identifier: id,
                            };
                            postData = {
                                action: "HANDLE_MAGIC_LINK_REDIRECT",
                                payload: payload,
                            };
                            CotterVerify.sendPost(postData, this.cotterIframeID);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CotterVerify.prototype.showEmailForm = function () {
        this.config.IdentifierField = "email";
        this.config.Type = IDENTIFIER_TYPE.EMAIL;
        return this.showForm();
    };
    CotterVerify.prototype.showPhoneForm = function () {
        this.config.IdentifierField = "phone";
        this.config.Type = IDENTIFIER_TYPE.PHONE;
        return this.showForm();
    };
    CotterVerify.prototype.showForm = function () {
        var _this = this;
        var containerID = this.config.ContainerID || cotter_DefaultContainerID;
        var container = document.getElementById(containerID);
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("id", this.cotterIframeID);
        ifrm.style.border = "0";
        container.appendChild(ifrm);
        ifrm.style.width = "100%";
        ifrm.style.height = "100%";
        if (this.config.CaptchaRequired) {
            ifrm.style.minHeight = "520px";
        }
        ifrm.style.overflow = "scroll";
        challengeFromVerifier(this.verifier).then(function (challenge) {
            var path = CotterEnum.JSURL + "/signup?challenge=" + challenge + "&type=" + _this.config.Type + "&domain=" + _this.config.Domain + "&api_key=" + _this.config.ApiKeyID + "&redirect_url=" + _this.config.RedirectURL + "&state=" + _this.state + "&id=" + _this.cID;
            if (_this.config.CotterUserID) {
                path = path + "&cotter_user_id=" + _this.config.CotterUserID;
            }
            if (_this.config.FormID) {
                path = path + "&form_id=" + encodeURIComponent(_this.config.FormID);
            }
            ifrm.setAttribute("src", encodeURI(path));
            ifrm.setAttribute("allowtransparency", "true");
        });
        return verificationProccessPromise(this);
    };
    CotterVerify.prototype.removeForm = function () {
        var ifrm = document.getElementById(this.cotterIframeID);
        ifrm.remove();
    };
    CotterVerify.prototype.onSuccess = function (data) {
        var postData = {
            action: "DONE_SUCCESS",
        };
        CotterVerify.sendPost(postData, this.cotterIframeID);
        this.verifySuccess = data;
        if (this.config.OnSuccess)
            this.config.OnSuccess(data);
    };
    CotterVerify.prototype.onError = function (error) {
        var postData = {
            action: "DONE_ERROR",
            payload: error,
        };
        CotterVerify.sendPost(postData, this.cotterIframeID);
        this.verifyError = error;
        if (this.config.OnError)
            this.config.OnError(error);
    };
    CotterVerify.prototype.submitAuthorizationCode = function (payload, code_verifier, redirect_url, auth_method) {
        if (redirect_url === void 0) { redirect_url = null; }
        if (auth_method === void 0) { auth_method = null; }
        return __awaiter(this, void 0, void 0, function () {
            var authorizationCode, challengeID, state, clientJson, skipRedirectURL, err, data, self, url;
            return __generator(this, function (_a) {
                authorizationCode = payload.authorization_code;
                challengeID = payload.challenge_id;
                state = payload.state;
                clientJson = payload.client_json;
                skipRedirectURL = this.config.RedirectURL === null ||
                    this.config.RedirectURL === undefined ||
                    (this.config.RedirectURL && this.config.RedirectURL.length <= 0) ||
                    this.config.SkipRedirectURL;
                // State was set before the first request was sent
                // This is making sure that the state returned is still the same
                if (state !== this.state) {
                    if (this.config.OnError) {
                        err = "State is not the same as the original request.";
                        this.config.OnError(err);
                    }
                }
                data = {
                    code_verifier: code_verifier,
                    authorization_code: authorizationCode,
                    challenge_id: parseInt(challengeID),
                    redirect_url: redirect_url
                        ? redirect_url
                        : skipRedirectURL
                            ? new URL(window.location.href).origin
                            : this.config.RedirectURL,
                };
                self = this;
                url = CotterEnum.BackendURL + "/verify/get_identity?oauth_token=true";
                if (auth_method) {
                    url = url + "&auth_method=" + auth_method;
                }
                fetch(url, {
                    method: "POST",
                    headers: {
                        API_KEY_ID: "" + self.config.ApiKeyID,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                    credentials: "include",
                })
                    .then(function (response) {
                    return __awaiter(this, void 0, void 0, function () {
                        var resp, data;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, response.json()];
                                case 1:
                                    resp = _a.sent();
                                    if (response.status !== 200) {
                                        response.data = resp;
                                        throw response;
                                    }
                                    data = clientJson;
                                    data.token = resp.token;
                                    data[self.config.IdentifierField || "email"] = resp.user.identifier;
                                    data.oauth_token = resp.oauth_token;
                                    data.user = resp.user;
                                    // Store Identifier in the object for WebAuthn reference
                                    self.Identifier = resp.user.identifier;
                                    UserHandler.store(resp.user);
                                    if (self.tokenHander) {
                                        self.tokenHander.storeTokens(resp.oauth_token);
                                    }
                                    // If skipRedirectURL, send the data to the client's OnSuccess function
                                    if (skipRedirectURL || !self.config.RedirectURL) {
                                        self.onSuccess(data);
                                        return [2 /*return*/];
                                    }
                                    else {
                                        // Otherwise, send POST request to the client's RedirectURL
                                        fetch(self.config.RedirectURL, {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify(data),
                                        })
                                            // Checking client's response
                                            .then(function (redirectResp) { return __awaiter(_this, void 0, void 0, function () {
                                            var contentType, redirectRespJSON, redirectRespText;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        contentType = redirectResp.headers.get("content-type");
                                                        if (!(contentType &&
                                                            contentType.indexOf("application/json") !== -1)) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, redirectResp.json()];
                                                    case 1:
                                                        redirectRespJSON = _a.sent();
                                                        if (redirectResp.status >= 200 && redirectResp.status < 300) {
                                                            self.onSuccess(redirectRespJSON);
                                                        }
                                                        else {
                                                            redirectResp.data = redirectRespJSON;
                                                            throw redirectResp;
                                                        }
                                                        return [3 /*break*/, 4];
                                                    case 2: return [4 /*yield*/, redirectResp.text()];
                                                    case 3:
                                                        redirectRespText = _a.sent();
                                                        if (redirectResp.status >= 200 && redirectResp.status < 300) {
                                                            self.onSuccess(redirectRespText);
                                                        }
                                                        else {
                                                            redirectResp.data = redirectRespText;
                                                            throw redirectResp;
                                                        }
                                                        _a.label = 4;
                                                    case 4: return [2 /*return*/];
                                                }
                                            });
                                        }); })
                                            .catch(function (error) {
                                            self.onError(error);
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                })
                    .catch(function (error) {
                    self.onError(error);
                });
                return [2 /*return*/];
            });
        });
    };
    CotterVerify.prototype.StopSubmissionWithError = function (err, iframeID) {
        var postData = {
            action: "ON_ERROR",
            errorMsg: err,
        };
        CotterVerify.sendPost(postData, iframeID);
    };
    CotterVerify.prototype.continue = function (payload, iframeID) {
        return __awaiter(this, void 0, void 0, function () {
            var available, api, exists, web, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WebAuthn.available()];
                    case 1:
                        available = _a.sent();
                        if (this.config.WebAuthnEnabled && !available) {
                            console.log("WebAuthn is enabled, but the user device doesn't support webauthn");
                        }
                        if (!(this.config.WebAuthnEnabled && available)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        api = new API(this.config.ApiKeyID);
                        return [4 /*yield*/, api.checkCredentialExist(payload.identifier)];
                    case 3:
                        exists = _a.sent();
                        // (2A) if User have credentials:
                        if (exists) {
                            // (a) if User's identity is NOT EXPIRED => user normally automatically
                            // log in. We want user to automatically login too,
                            // even with WebAuthn enabled
                            if (!payload.auth_required) {
                                this.RegisterWebAuthn = false;
                                this.config.WebAuthnEnabled = false;
                                CotterVerify.ContinueSubmit(payload, iframeID);
                                return [2 /*return*/];
                            }
                            // b) if User's identity is expired => user normally have to enter
                            // OTP/MagicLink. Instead, we prompt for WebAuthn
                            this.LoginWebAuthn = true;
                            this.ContinueSubmitData = payload; // For use if WebAuthn failed
                            web = new WebAuthn({
                                ApiKeyID: this.config.ApiKeyID,
                                Identifier: payload.identifier,
                                IdentifierField: this.config.IdentifierField,
                                IdentifierType: this.config.Type,
                                AlternativeMethod: this.config.AuthenticationMethodName,
                                Type: "LOGIN",
                            }, this.tokenHander);
                            web
                                .show()
                                .then(function (resp) {
                                if (resp.status === WebAuthn.CANCELED) {
                                    CotterVerify.ContinueSubmit(payload, iframeID);
                                    return;
                                }
                                if (resp.status === WebAuthn.SUCCESS) {
                                    _this.onSuccess(resp);
                                    return;
                                }
                            })
                                .catch(function (err) {
                                _this.onError(err);
                            });
                        }
                        else {
                            // (2B) if User doesn't have credentials:
                            // - We want to prompt user to setup WebAuthn at the end of the flow
                            this.RegisterWebAuthn = true;
                            CotterVerify.ContinueSubmit(payload, iframeID);
                        }
                        return [2 /*return*/];
                    case 4:
                        err_1 = _a.sent();
                        this.onError(err_1);
                        return [2 /*return*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        // WebAuthn not enabled
                        CotterVerify.ContinueSubmit(payload, iframeID);
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    CotterVerify.ContinueSubmit = function (payload, iframeID) {
        var postData = {
            action: "CONTINUE_SUBMIT",
            payload: payload,
        };
        CotterVerify.sendPost(postData, iframeID);
    };
    CotterVerify.sendPost = function (data, iframeID) {
        var ifrm = document.getElementById(iframeID);
        if (isIFrame(ifrm) && ifrm.contentWindow) {
            ifrm.contentWindow.postMessage(JSON.stringify(data), CotterEnum.JSURL);
        }
    };
    return CotterVerify;
}());
export default CotterVerify;
//# sourceMappingURL=CotterVerify.js.map
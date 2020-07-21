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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = __importDefault(require("./enum"));
const helper_1 = require("./helper");
const UserHandler_1 = __importDefault(require("./handler/UserHandler"));
const WebAuthn_1 = __importDefault(require("./WebAuthn"));
const API_1 = __importDefault(require("./API"));
// default container id
const cotter_DefaultContainerID = "cotter-form-container";
class CotterVerify {
    constructor(config, tokenHandler) {
        console.log("Using origin: ", new URL(window.location.href).origin);
        this.config = config;
        if (this.config.CotterBaseURL)
            enum_1.default.JSURL = this.config.CotterBaseURL;
        if (!this.config.CountryCode || this.config.CountryCode.length <= 0) {
            this.config.CountryCode = [enum_1.default.DefaultUSCode];
        }
        if (!this.config.AdditionalFields) {
            this.config.AdditionalFields = [];
        }
        this.config.Domain = new URL(window.location.href).origin;
        if (!this.config.CotterBackendURL) {
            this.config.CotterBackendURL = enum_1.default.BackendURL;
        }
        // storing access token
        this.tokenHander = tokenHandler;
        this.state = localStorage.getItem("COTTER_STATE");
        if (!localStorage.getItem("COTTER_STATE")) {
            this.state = Math.random().toString(36).substring(2, 15);
            localStorage.setItem("COTTER_STATE", this.state);
        }
        // SUPPORT PKCE
        this.verifier = helper_1.generateVerifier();
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
        window.addEventListener("message", (e) => {
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
            let cID = this.cID;
            switch (data.callbackName) {
                case cID + "FIRST_LOAD":
                    var postData = {
                        action: "CONFIG",
                        payload: {
                            additionalFields: this.config.AdditionalFields,
                            identifierField: this.config.IdentifierField,
                            buttonText: this.config.ButtonText,
                            buttonBackgroundColor: this.config.ButtonBackgroundColor,
                            buttonTextColor: this.config.ButtonTextColor,
                            errorColor: this.config.ErrorColor,
                            buttonBorderColor: this.config.ButtonBorderColor,
                            buttonWAText: this.config.ButtonWAText,
                            buttonWATextSubtitle: this.config.ButtonWATextSubtitle,
                            buttonWABackgroundColor: this.config.ButtonWABackgroundColor,
                            buttonWABorderColor: this.config.ButtonWABorderColor,
                            buttonWATextColor: this.config.ButtonWATextColor,
                            buttonWALogoColor: this.config.ButtonWALogoColor,
                            phoneChannels: this.config.PhoneChannels,
                            countryCode: this.config.CountryCode,
                            identifierFieldInitialValue: this.config
                                .IdentifierFieldInitialValue,
                            identifierFieldDisabled: this.config.IdentifierFieldDisabled,
                            skipIdentiferForm: this.config.SkipIdentifierForm,
                            skipIdentiferFormWithValue: this.config
                                .SkipIdentifierFormWithValue,
                            skipRedirectURL: this.config.RedirectURL === null ||
                                this.config.RedirectURL === undefined ||
                                (this.config.RedirectURL &&
                                    this.config.RedirectURL.length <= 0) ||
                                this.config.SkipRedirectURL
                                ? true
                                : false,
                            captchaRequired: this.config.CaptchaRequired,
                            styles: this.config.Styles,
                            // for magic link
                            authRequestText: this.config.AuthRequestText,
                            authenticationMethod: this.config.AuthenticationMethod,
                            // for terms of service
                            termsOfServiceLink: this.config.TermsOfServiceLink,
                            privacyPolicyLink: this.config.PrivacyPolicyLink,
                        },
                    };
                    CotterVerify.sendPost(postData, this.cotterIframeID);
                    break;
                case cID + "LOADED":
                    this.loaded = true;
                    break;
                case cID + "ON_SUCCESS":
                    if (this.config.OnSuccess) {
                        this.config.OnSuccess(data.payload);
                    }
                    this.verifySuccess = data.payload;
                    break;
                case cID + "ON_SUBMIT_AUTHORIZATION_CODE":
                    this.submitAuthorizationCode(data.payload);
                    break;
                case cID + "ON_ERROR":
                    if (this.config.OnError) {
                        this.config.OnError(data.payload);
                    }
                    this.verifyError = data.payload;
                    break;
                case cID + "ON_BEGIN":
                    // OnBegin method should return the error message
                    // if there is no error, return null
                    if (!!this.config.OnBegin) {
                        // if OnBegin is async
                        if (this.config.OnBegin.constructor.name === "AsyncFunction" ||
                            this.config.OnBegin.toString().includes("async")) {
                            this.config.OnBegin(data.payload).then((err) => {
                                if (!err)
                                    this.continue(data.payload, this.cotterIframeID);
                                else
                                    this.StopSubmissionWithError(err, this.cotterIframeID);
                            });
                        }
                        else {
                            let err = this.config.OnBegin(data.payload);
                            if (!err)
                                this.continue(data.payload, this.cotterIframeID);
                            else
                                this.StopSubmissionWithError(err, this.cotterIframeID);
                        }
                    }
                    else {
                        CotterVerify.ContinueSubmit(data.payload, this.cotterIframeID);
                    }
                    break;
                default:
                    break;
            }
        });
    }
    showEmailForm() {
        this.config.IdentifierField = "email";
        this.config.Type = "EMAIL";
        return this.showForm();
    }
    showPhoneForm() {
        this.config.IdentifierField = "phone";
        this.config.Type = "PHONE";
        return this.showForm();
    }
    showForm() {
        const containerID = this.config.ContainerID || cotter_DefaultContainerID;
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
        helper_1.challengeFromVerifier(this.verifier).then((challenge) => {
            var path = `${enum_1.default.JSURL}/signup?challenge=${challenge}&type=${this.config.Type}&domain=${this.config.Domain}&api_key=${this.config.ApiKeyID}&redirect_url=${this.config.RedirectURL}&state=${this.state}&id=${this.cID}`;
            if (this.config.CotterUserID) {
                path = `${path}&cotter_user_id=${this.config.CotterUserID}`;
            }
            ifrm.setAttribute("src", encodeURI(path));
        });
        ifrm.setAttribute("allowtransparency", "true");
        return helper_1.verificationProccessPromise(this);
    }
    removeForm() {
        var ifrm = document.getElementById(this.cotterIframeID);
        ifrm.remove();
    }
    onSuccess(data) {
        var postData = {
            action: "DONE_SUCCESS",
        };
        CotterVerify.sendPost(postData, this.cotterIframeID);
        this.verifySuccess = data;
        console.log("verifySuccess", data);
        if (this.config.OnSuccess)
            this.config.OnSuccess(data);
    }
    onError(error) {
        var postData = {
            action: "DONE_ERROR",
            payload: error,
        };
        CotterVerify.sendPost(postData, this.cotterIframeID);
        this.verifyError = error;
        console.log("verifyError", error);
        if (this.config.OnError)
            this.config.OnError(error);
    }
    submitAuthorizationCode(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // Getting code from payload
            var authorizationCode = payload.authorization_code;
            var challengeID = payload.challenge_id;
            var state = payload.state;
            var clientJson = payload.client_json;
            var skipRedirectURL = this.config.RedirectURL === null ||
                this.config.RedirectURL === undefined ||
                (this.config.RedirectURL && this.config.RedirectURL.length <= 0) ||
                this.config.SkipRedirectURL;
            // State was set before the first request was sent
            // This is making sure that the state returned is still the same
            if (state !== this.state) {
                if (this.config.OnError) {
                    var err = "State is not the same as the original request.";
                    console.log(err);
                    this.config.OnError(err);
                }
            }
            // Preparing data for PCKE token request
            var data = {
                code_verifier: this.verifier,
                authorization_code: authorizationCode,
                challenge_id: parseInt(challengeID),
                redirect_url: skipRedirectURL
                    ? new URL(window.location.href).origin
                    : this.config.RedirectURL,
            };
            var self = this;
            fetch(`${enum_1.default.BackendURL}/verify/get_identity?oauth_token=true`, {
                method: "POST",
                headers: {
                    API_KEY_ID: `${self.config.ApiKeyID}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            })
                .then(function (response) {
                return __awaiter(this, void 0, void 0, function* () {
                    // If not successful, call OnError and return
                    var resp = yield response.json();
                    if (response.status !== 200) {
                        response.data = resp;
                        throw response;
                    }
                    // Examine the text in the response
                    // Preparing data to return to the client
                    var data = clientJson;
                    data.token = resp.token;
                    data[self.config.IdentifierField || "email"] =
                        resp.identifier.identifier;
                    data.oauth_token = resp.oauth_token;
                    data.user = resp.user;
                    // Store Identifier in the object for WebAuthn reference
                    self.Identifier = resp.identifier.identifier;
                    UserHandler_1.default.store(resp.user);
                    console.log("SHOULD STORE TOKEN", self.tokenHander);
                    if (self.tokenHander) {
                        self.tokenHander.storeTokens(resp.oauth_token);
                    }
                    // If skipRedirectURL, send the data to the client's OnSuccess function
                    if (skipRedirectURL || !self.config.RedirectURL) {
                        self.onSuccess(data);
                        return;
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
                            .then((redirectResp) => __awaiter(this, void 0, void 0, function* () {
                            const contentType = redirectResp.headers.get("content-type");
                            if (contentType &&
                                contentType.indexOf("application/json") !== -1) {
                                var redirectRespJSON = yield redirectResp.json();
                                if (redirectResp.status >= 200 && redirectResp.status < 300) {
                                    self.onSuccess(redirectRespJSON);
                                }
                                else {
                                    redirectResp.data = redirectRespJSON;
                                    throw redirectResp;
                                }
                            }
                            else {
                                var redirectRespText = yield redirectResp.text();
                                if (redirectResp.status >= 200 && redirectResp.status < 300) {
                                    self.onSuccess(redirectRespText);
                                }
                                else {
                                    redirectResp.data = redirectRespText;
                                    throw redirectResp;
                                }
                            }
                        }))
                            .catch(function (error) {
                            self.onError(error);
                        });
                    }
                });
            })
                .catch((error) => {
                self.onError(error);
            });
        });
    }
    StopSubmissionWithError(err, iframeID) {
        var postData = {
            action: "ON_ERROR",
            errorMsg: err,
        };
        CotterVerify.sendPost(postData, iframeID);
    }
    continue(payload, iframeID) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for WebAuthn – if we can, we'll authenticate the users using WebAuthn instead
            // ========== WEBAUTHN CHECK ===========
            // - (1) if WebAuthn enabled && can perform webauthn: check if user has any webauthn credentialss
            // - (2A) if User have credentials:
            //      - (a) if User's identity is NOT EXPIRED => user normally automatically
            //        log in. We want user to automatically login too,
            //        even with WebAuthn enabled
            //      - (b) if User's identity is expired => user normally have to enter
            //        OTP/MagicLink. Instead, we prompt for WebAuthn
            // - (2B) if User doesn't have credentials:
            //      - We want to prompt user to setup WebAuthn at the end of the flow
            const available = yield WebAuthn_1.default.available();
            if (this.config.WebAuthnEnabled && !available) {
                console.log("WebAuthn is enabled, but the user device doesn't support webauthn");
            }
            if (this.config.WebAuthnEnabled && available) {
                try {
                    // (1) Check if user has webauthn credential
                    let api = new API_1.default(this.config.ApiKeyID);
                    const exists = yield api.checkCredentialExist(payload.identifier);
                    console.log("EXOSTS", exists);
                    // (2A) if User have credentials:
                    if (exists) {
                        // (a) if User's identity is NOT EXPIRED => user normally automatically
                        // log in. We want user to automatically login too,
                        // even with WebAuthn enabled
                        if (!payload.auth_required) {
                            this.RegisterWebAuthn = false;
                            this.config.WebAuthnEnabled = false;
                            CotterVerify.ContinueSubmit(payload, iframeID);
                            return;
                        }
                        // b) if User's identity is expired => user normally have to enter
                        // OTP/MagicLink. Instead, we prompt for WebAuthn
                        this.LoginWebAuthn = true;
                        this.ContinueSubmitData = payload; // For use if WebAuthn failed
                        // Start WebAuthn Login
                        let web = new WebAuthn_1.default({
                            ApiKeyID: this.config.ApiKeyID,
                            Identifier: payload.identifier,
                            IdentifierType: this.config.Type,
                            AlternativeMethod: this.config.AuthenticationMethodName,
                            Type: "LOGIN",
                        });
                        web
                            .show()
                            .then((resp) => {
                            if (resp.status === WebAuthn_1.default.CANCELED) {
                                CotterVerify.ContinueSubmit(payload, iframeID);
                                return;
                            }
                            if (resp.status === WebAuthn_1.default.SUCCESS) {
                                this.onSuccess(resp);
                                return;
                            }
                        })
                            .catch((err) => {
                            console.log(err);
                            this.onError(err);
                        });
                    }
                    else {
                        // (2B) if User doesn't have credentials:
                        // - We want to prompt user to setup WebAuthn at the end of the flow
                        this.RegisterWebAuthn = true;
                        CotterVerify.ContinueSubmit(payload, iframeID);
                    }
                    return;
                }
                catch (err) {
                    console.log(err);
                    this.onError(err);
                    return;
                }
            }
            else {
                // WebAuthn not enabled
                CotterVerify.ContinueSubmit(payload, iframeID);
            }
        });
    }
    static ContinueSubmit(payload, iframeID) {
        var postData = {
            action: "CONTINUE_SUBMIT",
            payload: payload,
        };
        CotterVerify.sendPost(postData, iframeID);
    }
    static sendPost(data, iframeID) {
        var ifrm = document.getElementById(iframeID);
        if (helper_1.isIFrame(ifrm) && ifrm.contentWindow) {
            ifrm.contentWindow.postMessage(JSON.stringify(data), enum_1.default.JSURL);
        }
    }
}
exports.default = CotterVerify;

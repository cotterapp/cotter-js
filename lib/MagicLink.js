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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CotterVerify_1 = __importDefault(require("./CotterVerify"));
var enum_1 = __importDefault(require("./enum"));
var binder_1 = require("./binder");
var helper_1 = require("./helper");
var checkPurple = function (url) { return url + "/assets/images/check-purple.png"; };
var warningImage = function (url) { return url + "/assets/images/warning.png"; };
var tapLinkImage = function (url) { return url + "/assets/images/tapEmail.png"; };
var magicLinkAuthReqText = function (url) { return ({
    title: "Approve this login from your {{type}}",
    subtitle: "A magic link has been sent to {{identifier}}",
    image: tapLinkImage(url),
    titleError: "Something went wrong",
    subtitleError: "We are unable to confirm it's you, please try again",
    imageError: warningImage(url),
    imageSuccess: checkPurple(url),
    switchOTPText: "Authenticate with OTP instead",
    default: true,
}); };
var MagicLink = /** @class */ (function (_super) {
    __extends(MagicLink, _super);
    function MagicLink(config, tokenHandler) {
        var _this = this;
        var defaultMagicLinkConfig = {
            AuthenticationMethod: binder_1.AUTHENTICATION_METHOD.MAGIC_LINK,
        };
        if (config.RedirectMagicLink !== false) {
            config.RedirectMagicLink = true;
        }
        // set default magic link, then assign the new configs if any
        _this = _super.call(this, Object.assign(__assign({}, defaultMagicLinkConfig), config), tokenHandler) || this;
        return _this;
    }
    MagicLink.prototype.showForm = function () {
        var _this = this;
        // set the authentication request config
        this.config.AuthRequestText = magicLinkAuthReqText(enum_1.default.AssetURL);
        var containerID = this.config.ContainerID || enum_1.default.DefaultContainerID;
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
        if (!this.config.RedirectURL)
            this.config.RedirectURL = window.location.href;
        this.config.SkipRedirectURL = true;
        helper_1.challengeFromVerifier(this.verifier).then(function (challenge) {
            var path = enum_1.default.JSURL + "/login?auth_method=MAGIC_LINK&code_challenge=" + challenge + "&type=" + _this.config.Type + "&domain=" + _this.config.Domain + "&api_key=" + _this.config.ApiKeyID + "&redirect_url=" + encodeURIComponent(_this.config.RedirectURL) + "&state=" + _this.state + "&id=" + _this.cID + "&redirect_link=" + _this.config.RedirectMagicLink;
            if (_this.config.CotterUserID) {
                path = path + "&cotter_user_id=" + _this.config.CotterUserID;
            }
            if (_this.config.FormID) {
                path = path + "&form_id=" + encodeURIComponent(_this.config.FormID);
            }
            ifrm.setAttribute("src", encodeURI(path));
        });
        ifrm.setAttribute("allowtransparency", "true");
        return helper_1.verificationProccessPromise(this);
    };
    return MagicLink;
}(CotterVerify_1.default));
exports.default = MagicLink;
//# sourceMappingURL=MagicLink.js.map
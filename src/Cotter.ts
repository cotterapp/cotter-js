import CotterVerify from "./CotterVerify";
import MagicLink from "./MagicLink";
import TokenHandler from "./handler/TokenHandler";
import User from "./models/User";
import WebAuthn from "./WebAuthn";
import UserHandler from "./handler/UserHandler";
import {
  AUTHENTICATION_METHOD,
  Config,
  OnBeginHandler,
  SocialLoginProviders,
} from "./binder";
import SocialLogin from "./SocialLogin";

const tokenHandler = new TokenHandler();
export default class Cotter extends CotterVerify {
  signInWithLink: (onBegin?: OnBeginHandler) => MagicLink;
  signInWithOTP: (onBegin?: OnBeginHandler) => CotterVerify;
  signInWithWebAuthnOrLink: (onBegin?: OnBeginHandler) => MagicLink;
  signInWithWebAuthnOrOTP: (onBegin?: OnBeginHandler) => CotterVerify;
  tokenHandler: TokenHandler;

  // constructor can be either string or object therefore the type is any
  constructor(config: Config | string) {
    // in this case config will definitely be the API KEY ID
    if (typeof config === typeof "") {
      config = { ApiKeyID: config as string, Type: "" };
    }
    config = config as Config;

    super(config, tokenHandler.withApiKeyID(config.ApiKeyID));

    // initialize magic link
    this.signInWithLink = this.constructMagicLink;
    this.signInWithWebAuthnOrLink = this.constructMagicLinkWithWebAuthn;

    this.signInWithOTP = this.constructOTPVerify;
    this.signInWithWebAuthnOrOTP = this.constructOTPVerifyWithWebAuthn;

    // initialize token handler
    this.tokenHandler = tokenHandler.withApiKeyID(config.ApiKeyID);
  }

  // withFormID specify the form ID used for customization
  withFormID(formID: string) {
    this.config.FormID = formID;
    return this;
  }

  // constructMagicLink constructs the magic link object with optional onBegin
  constructMagicLink(onBegin?: OnBeginHandler) {
    if (onBegin) this.config.OnBegin = onBegin;
    this.config.AuthenticationMethod = AUTHENTICATION_METHOD.MAGIC_LINK;
    this.config.AuthenticationMethodName = "Magic Link";
    return new MagicLink(this.config, this.tokenHander);
  }

  constructOTPVerify(onBegin?: OnBeginHandler) {
    if (onBegin) this.config.OnBegin = onBegin;
    this.config.AuthenticationMethod = AUTHENTICATION_METHOD.OTP;
    this.config.AuthenticationMethodName = "Verification Code";
    return new CotterVerify(this.config, this.tokenHander);
  }
  // ========== WEBAUTHN ============
  static async isWebAuthnAvailable() {
    return await WebAuthn.available();
  }
  // constructMagicLinkWithWebAuthn constructs the magic link to run attempt login with webauthn
  constructMagicLinkWithWebAuthn(onBegin?: OnBeginHandler) {
    if (onBegin) this.config.OnBegin = onBegin;
    this.config.WebAuthnEnabled = true;
    this.config.AuthenticationMethod = AUTHENTICATION_METHOD.MAGIC_LINK;
    this.config.AuthenticationMethodName = "Magic Link";
    return new MagicLink(this.config, this.tokenHander);
  }
  // constructOTPVerifyWithWebAuthn constructs the otp to run attempt login with webauthn
  constructOTPVerifyWithWebAuthn(onBegin?: OnBeginHandler) {
    if (onBegin) this.config.OnBegin = onBegin;
    this.config.WebAuthnEnabled = true;
    this.config.AuthenticationMethod = AUTHENTICATION_METHOD.OTP;
    this.config.AuthenticationMethodName = "Verification Code";
    return new CotterVerify(this.config, this.tokenHander);
  }

  // Register WebAuthn for a logged-in user
  async registerWebAuthn(identifier: string) {
    this.config.WebAuthnEnabled = true;
    this.config.RegisterWebAuthn = true;
    const available = await WebAuthn.available();
    if (!available) {
      let web = new WebAuthn(
        {
          ApiKeyID: this.config.ApiKeyID,
          Identifier: identifier,
          Type: "REGISTRATION",
          ErrorDisplay: "The browser or user device doesn't support WebAuthn.",
          RegisterWebAuthn: true,
        },
        this.tokenHander
      );
      return await web.show();
    }
    let web = new WebAuthn(
      {
        ApiKeyID: this.config.ApiKeyID,
        Identifier: identifier,
        Type: "REGISTRATION",
        RegisterWebAuthn: true,
      },
      this.tokenHander
    );
    return await web.show();
  }

  // Token handling
  async logOut() {
    try {
      await this.tokenHandler.removeTokens();
      UserHandler.remove();
    } catch (err) {
      throw err;
    }
  }

  // Get User
  getLoggedInUser() {
    return User.getLoggedInUser(this);
  }

  // Social Login
  // This should redirect to the oauth login page,
  // then redirect back to the `redirectURL` provided
  // with `error` query parameter if there's an error
  // ex. http://something.com/currentpage?error=some_error
  connectSocialLogin(
    provider: SocialLoginProviders,
    userAccessToken: string,
    redirectURL?: string
  ) {
    const connectURL = SocialLogin.getConnectURL(
      provider,
      this.config.ApiKeyID,
      userAccessToken,
      redirectURL || window?.location?.href
    );
    if (window) {
      window.location.href = connectURL;
    }
  }
}

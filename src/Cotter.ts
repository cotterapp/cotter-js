import CotterVerify from "./CotterVerify";
import MagicLink from "./MagicLink";
import TokenHandler from "./handler/TokenHandler";
import User from "./models/User";
import WebAuthn from "./WebAuthn";
import UserHandler from "./handler/UserHandler";
import { Config, Payload } from "./binder";

const tokenHandler = new TokenHandler();
export default class Cotter extends CotterVerify {
  signInWithLink: (
    onBegin: (payload: Payload) => Promise<boolean> | boolean
  ) => MagicLink;
  signInWithOTP: (
    onBegin: (payload: Payload) => Promise<boolean> | boolean
  ) => CotterVerify;
  signInWithWebAuthnOrLink: (
    onBegin: (payload: Payload) => Promise<boolean> | boolean
  ) => MagicLink;
  signInWithWebAuthnOrOTP: (
    onBegin: (payload: Payload) => Promise<boolean> | boolean
  ) => CotterVerify;
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

  // constructMagicLink constructs the magic link object with optional onBegin
  constructMagicLink(
    onBegin: (payload: Payload) => Promise<boolean> | boolean
  ) {
    if (onBegin) this.config.OnBegin = onBegin;
    this.config.AuthenticationMethod = "MAGIC_LINK";
    this.config.AuthenticationMethodName = "Magic Link";
    return new MagicLink(this.config, this.tokenHander);
  }

  constructOTPVerify(
    onBegin: (payload: Payload) => Promise<boolean> | boolean
  ) {
    if (onBegin) this.config.OnBegin = onBegin;
    this.config.AuthenticationMethod = "OTP";
    this.config.AuthenticationMethodName = "Verification Code";
    return new CotterVerify(this.config, this.tokenHander);
  }
  // ========== WEBAUTHN ============
  static async isWebAuthnAvailable() {
    return await WebAuthn.available();
  }
  // constructMagicLinkWithWebAuthn constructs the magic link to run attempt login with webauthn
  constructMagicLinkWithWebAuthn(
    onBegin: (payload: Payload) => Promise<boolean> | boolean
  ) {
    if (onBegin) this.config.OnBegin = onBegin;
    this.config.WebAuthnEnabled = true;
    this.config.AuthenticationMethod = "MAGIC_LINK";
    this.config.AuthenticationMethodName = "Magic Link";
    console.log("CONSTRU", this.tokenHander);
    return new MagicLink(this.config, this.tokenHander);
  }
  // constructOTPVerifyWithWebAuthn constructs the otp to run attempt login with webauthn
  constructOTPVerifyWithWebAuthn(
    onBegin: (payload: Payload) => Promise<boolean> | boolean
  ) {
    if (onBegin) this.config.OnBegin = onBegin;
    this.config.WebAuthnEnabled = true;
    this.config.AuthenticationMethod = "OTP";
    this.config.AuthenticationMethodName = "Verification Code";
    return new CotterVerify(this.config, this.tokenHander);
  }

  // Register WebAuthn for a logged-in user
  async registerWebAuthn(identifier: string) {
    this.config.WebAuthnEnabled = true;
    this.config.RegisterWebAuthn = true;
    const available = await WebAuthn.available();
    if (!available) {
      let web = new WebAuthn({
        ApiKeyID: this.config.ApiKeyID,
        Identifier: identifier,
        Type: "REGISTRATION",
        ErrorDisplay: "The browser or user device doesn't support WebAuthn.",
        RegisterWebAuthn: true,
      });
      return await web.show();
    }
    let web = new WebAuthn({
      ApiKeyID: this.config.ApiKeyID,
      Identifier: identifier,
      Type: "REGISTRATION",
      RegisterWebAuthn: true,
    });
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
}

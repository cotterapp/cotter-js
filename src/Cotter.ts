import CotterVerify from "./CotterVerify";
import MagicLink from "./MagicLink";
import { Config } from "./binder";
import TokenHandler from "./TokenHandler";
import User from "./models/User";

export default class Cotter extends CotterVerify {
  static AssetURL = "https://js.cotter.app";
  static BackendURL = "https://www.cotter.app/api/v0";
  static JSURL = "https://js.cotter.app";

  signInWithLink: Function;
  signInWithOTP: Function;
  tokenHandler: TokenHandler;

  // constructor can be either string or object therefore the type is any
  constructor(config: any) {
    // in this case config will definitely be the API KEY ID
    if (typeof config === typeof "") {
      config = { ApiKeyID: config };
    }

    super(config);

    // initialize magic link
    this.signInWithLink = this.constructMagicLink;

    this.signInWithOTP = this.constructOTPVerify;

    // initialize token handler
    this.tokenHandler = new TokenHandler(config.ApiKeyID);
  }

  // constructMagicLink constructs the magic link object with optional onBegin
  constructMagicLink(onBegin: Function) {
    if (onBegin) this.config.OnBegin = onBegin;
    return new MagicLink(this.config);
  }

  constructOTPVerify(onBegin: Function) {
    if (onBegin) this.config.OnBegin = onBegin;
    return new CotterVerify(this.config, this.tokenHander);
  }

  // Token handling
  async logOut() {
    try {
      await this.tokenHandler.removeTokens();
    } catch (err) {
      throw err;
    }
  }

  // Get User
  getLoggedInUser() {
    return User.getLoggedInUser(this);
  }
}

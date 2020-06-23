import CotterVerify from "./CotterVerify";
import MagicLink from "./MagicLink";
import { Config } from "./binder";

export default class Cotter extends CotterVerify {
  signInWithLink: Function;
  signInWithOTP: Function;
  
  // constructor can be either string or object therefore the type is any
  constructor(config:any) {
    // in this case config will definitely be the API KEY ID
    if (typeof config === typeof "") {
      config = { ApiKeyID: config };
    }

    super(config);

    // initialize magic link
    this.signInWithLink = this.constructMagicLink;

    this.signInWithOTP = this.constructOTPVerify;
  }

  // constructMagicLink constructs the magic link object with optional onBegin
  constructMagicLink(onBegin: Function) {
    if (onBegin) this.config.OnBegin = onBegin;
    return new MagicLink(this.config);
  }

  constructOTPVerify(onBegin: Function) {
    if (onBegin) this.config.OnBegin = onBegin;
    return new CotterVerify(this.config);
  }
}

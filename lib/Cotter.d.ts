import CotterVerify from "./CotterVerify";
import MagicLink from "./MagicLink";
import TokenHandler from "./handler/TokenHandler";
import User from "./models/User";
import { Config, OnBeginHandler, SocialLoginProviders } from "./binder";
export default class Cotter extends CotterVerify {
    signInWithLink: (onBegin?: OnBeginHandler) => MagicLink;
    signInWithOTP: (onBegin?: OnBeginHandler) => CotterVerify;
    signInWithWebAuthnOrLink: (onBegin?: OnBeginHandler) => MagicLink;
    signInWithWebAuthnOrOTP: (onBegin?: OnBeginHandler) => CotterVerify;
    tokenHandler: TokenHandler;
    constructor(config: Config | string);
    withFormID(formID: string): this;
    constructMagicLink(onBegin?: OnBeginHandler): MagicLink;
    constructOTPVerify(onBegin?: OnBeginHandler): CotterVerify;
    static isWebAuthnAvailable(): Promise<boolean>;
    constructMagicLinkWithWebAuthn(onBegin?: OnBeginHandler): MagicLink;
    constructOTPVerifyWithWebAuthn(onBegin?: OnBeginHandler): CotterVerify;
    registerWebAuthn(identifier: string): Promise<import("./binder").VerifySuccess>;
    logOut(): Promise<void>;
    getLoggedInUser(): User;
    connectSocialLogin(provider: SocialLoginProviders, userAccessToken: string, redirectURL?: string): void;
}

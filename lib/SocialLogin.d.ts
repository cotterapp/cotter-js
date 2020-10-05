import { Config, SocialLoginProviders } from "./binder";
import ModalMaker from "./components/ModalMaker";
declare class SocialLogin {
    static LOGIN_KEY: string;
    static OAUTH_SESSION_NAME: string;
    loaded: boolean;
    cotterIframeID: string;
    containerID: string;
    cancelDivID: string;
    modalID: string;
    Modal: ModalMaker;
    verifyError?: any;
    verifySuccess?: any;
    config: Config;
    static getAuthorizeURL(provider: string, apiKeyId: string, state: string, redirectURL: string, codeChallenge: string): string;
    static getConnectURL(provider: SocialLoginProviders, apiKeyId: string, accessToken: string, redirectURL: string): string;
    constructor(config: Config);
    init(): void;
    initEventHandler(): void;
    static sendPost(data: object, iframeID: string): void;
    show(): Promise<import("./binder").VerifySuccess>;
    cancel(): void;
    onSuccess(data: any): void;
    onError(error: any): void;
    loginAndConnect(payload: {
        tokenID: string;
        userID: string;
        provider: string;
    }): Promise<void>;
}
export default SocialLogin;

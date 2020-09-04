import { Config, VerifyRespondResponse, VerifySuccess } from "./binder";
import TokenHandler from "./handler/TokenHandler";
declare class CotterVerify {
    config: Config;
    state: string | null;
    loaded: boolean;
    cotterIframeID: string;
    verifier: string;
    challenge: string;
    cID: string;
    verifyError?: any;
    verifySuccess?: any;
    tokenHander?: TokenHandler;
    RegisterWebAuthn?: boolean;
    Identifier?: string;
    LoginWebAuthn?: boolean;
    ContinueSubmitData?: any;
    constructor(config: Config, tokenHandler?: TokenHandler);
    handleRedirect(): Promise<void>;
    showEmailForm(): Promise<VerifySuccess>;
    showPhoneForm(): Promise<VerifySuccess>;
    showForm(): Promise<VerifySuccess>;
    removeForm(): void;
    onSuccess(data: VerifySuccess | string): void;
    onError(error: object | string): void;
    submitAuthorizationCode(payload: VerifyRespondResponse, code_verifier: string, redirect_url?: string, auth_method?: string): Promise<void>;
    StopSubmissionWithError(err: string, iframeID: string): void;
    continue(payload: {
        identifier: string;
        auth_required?: boolean;
    }, iframeID: string): Promise<void>;
    static ContinueSubmit(payload: object, iframeID: string): void;
    static sendPost(data: object, iframeID: string): void;
}
export default CotterVerify;

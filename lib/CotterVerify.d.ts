import { Config, VerifyRespondResponse } from "./binder";
declare class CotterVerify {
    config: Config;
    state: string | null;
    loaded: boolean;
    cotterIframeID: string;
    verifier: string;
    cID: string;
    verifyError?: any;
    verifySuccess?: any;
    constructor(config: Config);
    showEmailForm(): Promise<unknown>;
    showPhoneForm(): Promise<unknown>;
    showForm(): Promise<unknown>;
    removeForm(): void;
    submitAuthorizationCode(payload: VerifyRespondResponse): Promise<void>;
    static StopSubmissionWithError(err: string, iframeID: string): void;
    static ContinueSubmit(payload: object, iframeID: string): void;
    static sendPost(data: object, iframeID: string): void;
}
export default CotterVerify;

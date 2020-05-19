interface Config {
    ApiKeyID: string;
    Type: string;
    ContainerID: string;
    OnSuccess: Function;
    IdentifierField: string;
    CotterBaseURL?: string;
    CountryCode?: string[];
    AdditionalFields?: Object[];
    Domain?: string;
    ButtonText?: string;
    ButtonTextColor?: string;
    ErrorColor?: string;
    ButtonBorderColor?: string;
    ButtonWAText?: string;
    ButtonBackgroundColor?: string;
    ButtonWATextSubtitle?: string;
    ButtonWABackgroundColor?: string;
    ButtonWABorderColor?: string;
    ButtonWATextColor?: string;
    ButtonWALogoColor?: string;
    PhoneChannels?: string[];
    IdentifierFieldInitialValue?: string;
    IdentifierFieldDisabled?: string;
    SkipIdentifierForm?: string;
    SkipIdentifierFormWithValue?: string;
    RedirectURL?: string;
    SkipRedirectURL?: boolean;
    CaptchaRequired?: boolean;
    Styles?: Object;
    OnError?: Function;
    OnBegin?: Function;
}
declare class Cotter {
    config: Config;
    state: string | null;
    loaded: boolean;
    cotterIframeID: string;
    constructor(config: Config);
    showForm(): void;
    removeForm(): void;
    static StopSubmissionWithError(err: string, iframeID: string): void;
    static ContinueSubmit(payload: object, iframeID: string): void;
    static sendPost(data: object, iframeID: string): void;
}
export default Cotter;

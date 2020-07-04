export interface VerifyRespondResponse {
  authorization_code: string;
  challenge_id: string;
  state: string;
  client_json: any;
}

export interface ResponseData extends Response {
  data?: any;
}

export interface Config {
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
  CotterUserID?: String;
  AuthRequestText: Object;
  AuthenticationMethod: String;
  TermsOfServiceLink?: String;
  PrivacyPolicyLink?: String;
}

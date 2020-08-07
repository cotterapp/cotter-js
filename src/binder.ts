export interface VerifyRespondResponse {
  authorization_code: string;
  challenge_id: string;
  state: string;
  client_json: any;
}

export interface ResponseData extends Response {
  data?: any;
}

export interface WebAuthnRegistrationText {
  title: string;
  subtitle: string;
  button: string;
  buttonSkip: string;
  theme: string;
}
export interface WebAuthnLoginText {
  title: string;
  subtitle: string;
  button: string;
  buttonSkip: string;
  theme: string;
  waiting: string;
}

export interface Config {
  ApiKeyID: string;
  Type: string;
  ContainerID?: string;
  OnSuccess?: Function;
  IdentifierField?: string;
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
  AuthRequestText?: Object;
  AuthenticationMethod?: String;

  // For WebAuthn
  WebAuthnEnabled?: boolean;
  RegistrationText?: WebAuthnRegistrationText;
  LoginText?: WebAuthnLoginText;
  OriginalResponse?: any;
  ErrorDisplay?: string;
  CotterBackendURL?: string;
  AlternativeMethod?: string;
  Identifier?: string;
  RegisterWebAuthn?: boolean;
  IdentifierType?: string;
  AuthenticationMethodName?: string;
  TermsOfServiceLink?: String;
  PrivacyPolicyLink?: String;
}
export interface Payload {
  challenge: string;
  challenge_id: number;
  client_json: any;
  code: string;
  device_name: string;
  device_type: string;
  identifier: string;
  identifier_type: string;
  origin: string;
  public_key: string;
  redirect_url: string;
  signature: string;
  timestamp: string;
}

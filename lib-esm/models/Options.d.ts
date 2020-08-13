interface IPublicKeyCredentialCreationOptionsServer {
    challenge: string;
    attestation?: AttestationConveyancePreference;
    authenticatorSelection?: AuthenticatorSelectionCriteria;
    excludeCredentials?: IPublicKeyCredentialDescriptor[];
    extensions?: AuthenticationExtensionsClientInputs;
    pubKeyCredParams: PublicKeyCredentialParameters[];
    rp: PublicKeyCredentialRpEntity;
    timeout?: number;
    user: UserEntity;
}
interface IPublicKeyCredentialDescriptor {
    id: string;
    transports?: AuthenticatorTransport[];
    type: PublicKeyCredentialType;
}
interface IPublicKeyCredentialRequestOptions {
    allowCredentials?: IPublicKeyCredentialDescriptor[];
    challenge: string;
    extensions?: AuthenticationExtensionsClientInputs;
    rpId?: string;
    timeout?: number;
    userVerification?: UserVerificationRequirement;
}
export declare function serverToCreationOptions(options: IPublicKeyCredentialCreationOptionsServer): PublicKeyCredentialCreationOptions;
export declare function serverToRequestOptions(options: IPublicKeyCredentialRequestOptions): PublicKeyCredentialRequestOptions;
export declare function CredentialToServerCredentialCreation(credential: any): any;
export declare function CredentialToServerCredentialRequest(credential: any): any;
interface UserEntity {
    name: string;
    icon: string;
    displayName: string;
    id: string;
}
export {};

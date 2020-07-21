import User from "./User";
import { base64urlencode, base64urldecode } from "../helper";

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

export function serverToCreationOptions(
  options: IPublicKeyCredentialCreationOptionsServer
): PublicKeyCredentialCreationOptions {
  let formattedExcludeCred = options.excludeCredentials
    ? options.excludeCredentials.map((item) => ({
        ...item,
        id: base64urldecode(item.id),
      }))
    : undefined;
  var opts = {
    ...options,
    challenge: base64urldecode(options.challenge),
    user: {
      ...options.user,
      id: base64urldecode(options.user.id),
    },
    excludeCredentials: formattedExcludeCred,
  };
  return opts;
}

export function serverToRequestOptions(
  options: IPublicKeyCredentialRequestOptions
): PublicKeyCredentialRequestOptions {
  let formattedAllowCred = options.allowCredentials
    ? options.allowCredentials.map((item) => ({
        ...item,
        id: base64urldecode(item.id),
      }))
    : undefined;
  var opts = {
    ...options,
    challenge: base64urldecode(options.challenge),
    allowCredentials: formattedAllowCred,
  };
  return opts;
}

export function CredentialToServerCredentialCreation(credential: any): any {
  return {
    id: credential.id,
    rawId: base64urlencode(credential.rawId),
    response: {
      clientDataJSON: base64urlencode(credential.response.clientDataJSON),
      attestationObject: base64urlencode(credential.response.attestationObject),
    },
    type: credential.type,
  };
}

export function CredentialToServerCredentialRequest(credential: any): any {
  return {
    id: credential.id,
    rawId: base64urlencode(credential.rawId),
    response: {
      authenticatorData: base64urlencode(credential.response.authenticatorData),
      clientDataJSON: base64urlencode(credential.response.clientDataJSON),
      signature: base64urlencode(credential.response.signature),
      userHandle: base64urlencode(credential.response.userHandle),
    },
    type: credential.type,
  };
}
// interface RelyingPartyEntity {
//   name: string;
//   icon: string;
//   id: string;
// }

interface UserEntity {
  name: string;
  icon: string;
  displayName: string;
  id: string;
}

// interface CredentialParameter {
//   type: string;
//   alg: number;
// }

// interface AuthenticatorSelection {
//   authenticatorAttachment: string;
//   requireResidentKey: boolean | null;
//   userVerification: string;
// }

// interface CredentialDescriptor {
//   type: string;
//   id: Int8Array;
//   transports: string[];
// }

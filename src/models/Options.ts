import User from "./User";
import { base64urlencode, base64urldecode } from "../helper";

interface IPublicKeyCredentialCreationOptionsServer {
  challenge: string;
  attestation?: AttestationConveyancePreference;
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  excludeCredentials?: PublicKeyCredentialDescriptor[];
  extensions?: AuthenticationExtensionsClientInputs;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  rp: PublicKeyCredentialRpEntity;
  timeout?: number;
  user: UserEntity;
}

export function serverToCreationOptions(
  options: IPublicKeyCredentialCreationOptionsServer
): PublicKeyCredentialCreationOptions {
  console.log("OPTS", options);
  var opts = {
    ...options,
    challenge: base64urldecode(options.challenge),
    user: {
      ...options.user,
      id: base64urldecode(options.user.id),
    },
  };
  console.log("OPTS", opts);
  return opts;
}

export function CredentialToServerCredential(credential: any): any {
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

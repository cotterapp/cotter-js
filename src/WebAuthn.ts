import API from "./API";
import User from "./models/User";
import { CredentialToServerCredential } from "./models/Options";

class WebAuthn {
  apiKeyID: string;
  static METHOD: "WEBAUTHN";

  constructor(apiKeyID: string) {
    this.apiKeyID = apiKeyID;
  }

  async beginRegistration(cotterUserID: string, origin: string): Promise<any> {
    let api = new API(this.apiKeyID);
    let options = await api.beginWebAuthnRegistration(cotterUserID);

    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    try {
      const credential = await navigator.credentials.create({
        publicKey: options,
      });
      console.log("FROM CREATE OPTS", options);
      console.log("FROM CREATE", CredentialToServerCredential(credential));
      if (!credential) {
        throw "Unable to create credential";
      }
      return await this.finishRegistration(credential, cotterUserID, origin);
    } catch (err) {
      throw err;
    }
  }

  async finishRegistration(
    credential: Object,
    cotterUserID: string,
    origin: string
  ): Promise<any> {
    let api = new API(this.apiKeyID);
    try {
      console.log("CREDENTIAL", credential);
      let resp = await api.registerWebAuthn(cotterUserID, credential, origin);
      return resp;
    } catch (err) {
      throw err;
    }
  }
}

export default WebAuthn;

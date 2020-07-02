import CotterEnum from "./enum";
import axios from "axios";
import { OAuthToken } from "./TokenHandler";
import Cotter from ".";
import {
  serverToCreationOptions,
  CredentialToServerCredential,
} from "./models/Options";
import { base64urlencode } from "./helper";

class API {
  apiKeyID: string;

  constructor(apiKeyID: string) {
    this.apiKeyID = apiKeyID;
  }

  // refreshToken should now be stored in httpOnly cookies
  // and no longer needed to be passed in.
  async getTokensFromRefreshToken(): Promise<OAuthToken> {
    try {
      var config = {
        headers: {
          API_KEY_ID: this.apiKeyID,
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      const path = "/token";
      const req = {
        grant_type: "refresh_token",
      };
      var resp = await axios.post(`${Cotter.BackendURL}${path}`, req, config);
      return resp.data;
    } catch (err) {
      throw err.response.data;
    }
  }

  // removeRefreshToken will delete the cookie
  // since it's httpOnly, can only be removed from
  // the backend
  async removeRefreshToken() {
    try {
      var config = {
        headers: {
          API_KEY_ID: this.apiKeyID,
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      const path = "/token";
      var resp = await axios.delete(`${Cotter.BackendURL}${path}`, config);
      return resp.data;
    } catch (err) {
      throw err.response.data;
    }
  }

  // begin webauthn registration, grab options from the backend
  // regarding allowed authenticator algorithms etc.
  async beginWebAuthnRegistration(
    cotterUserID: string
  ): Promise<PublicKeyCredentialCreationOptions> {
    try {
      var config = {
        headers: {
          API_KEY_ID: this.apiKeyID,
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      const path = "/webauthn/register";
      var resp = await axios.get(
        `${Cotter.BackendURL}${path}?cotter_user_id=${cotterUserID}`,
        config
      );
      if (resp.data && resp.data.publicKey) {
        console.log(resp.data);
        return serverToCreationOptions(resp.data.publicKey);
      }
      throw resp;
    } catch (err) {
      if (err.response) {
        throw err.response.data;
      }
      throw err;
    }
  }

  // Update User's Methods by enrolling WebAuthn
  async registerWebAuthn(
    cotterUserID: string,
    credential: any,
    origin: string
  ): Promise<any> {
    try {
      var config = {
        headers: {
          API_KEY_ID: this.apiKeyID,
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      var data = CredentialToServerCredential(credential);
      data = {
        ...data,
        origin: origin,
      };
      var path = "/webauthn/register";
      var resp = await axios.post(
        `${Cotter.BackendURL}${path}?cotter_user_id=${cotterUserID}`,
        data,
        config
      );
      return resp.data;
    } catch (err) {
      console.log(err);
      if (err.response) {
        throw err.response.data;
      }
      throw err;
    }
  }
}

export default API;

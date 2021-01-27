import CotterEnum from "./enum";
import axios from "axios";
import { OAuthToken } from "./handler/TokenHandler";
import { RefreshTokenRequest } from "./binder";
import {
  serverToCreationOptions,
  CredentialToServerCredentialCreation,
  CredentialToServerCredentialRequest,
  serverToRequestOptions,
} from "./models/Options";
import SocialLogin from "./SocialLogin";

class API {
  apiKeyID: string;

  constructor(apiKeyID: string) {
    this.apiKeyID = apiKeyID;
  }

  // refreshToken should now be stored in httpOnly cookies
  // and no longer needed to be passed in.
  async getTokensFromRefreshToken(
    refreshToken: string | null
  ): Promise<OAuthToken> {
    try {
      var config = {
        headers: {
          API_KEY_ID: this.apiKeyID,
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      const path = `/token/${this.apiKeyID}`;
      let req: RefreshTokenRequest = {
        grant_type: "refresh_token",
      };
      if (refreshToken) {
        req.refresh_token = refreshToken;
      }
      var resp = await axios.post(
        `${CotterEnum.BackendURL}${path}`,
        req,
        config
      );
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
      const path = `/token/${this.apiKeyID}`;
      var resp = await axios.delete(`${CotterEnum.BackendURL}${path}`, config);
      return resp.data;
    } catch (err) {
      throw err.response.data;
    }
  }

  // begin webauthn registration, grab options from the backend
  // regarding allowed authenticator algorithms etc.
  async checkCredentialExist(identifier: string): Promise<boolean> {
    try {
      var config = {
        headers: {
          API_KEY_ID: this.apiKeyID,
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      const path = "/webauthn/exists";
      var resp = await axios.get(
        `${CotterEnum.BackendURL}${path}?identifier=${encodeURIComponent(
          identifier
        )}`,
        config
      );

      if (
        resp.data &&
        resp.data.exists !== null &&
        resp.data.exists !== undefined
      ) {
        return resp.data.exists;
      }
      throw resp;
    } catch (err) {
      if (err.response) {
        throw err.response.data;
      }
      throw err;
    }
  }

  // begin webauthn registration, grab options from the backend
  // regarding allowed authenticator algorithms etc.
  async beginWebAuthnRegistration(
    identifier: string,
    origin: string
  ): Promise<PublicKeyCredentialCreationOptions> {
    try {
      var config = {
        headers: {
          API_KEY_ID: this.apiKeyID,
          "Content-type": "application/json",
        },
        withCredentials: true,
      };

      var data = {
        origin: origin,
      };
      const path = "/webauthn/register/begin";
      var resp = await axios.post(
        `${CotterEnum.BackendURL}${path}?identifier=${encodeURIComponent(
          identifier
        )}`,
        data,
        config
      );
      if (resp.data && resp.data.publicKey) {
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
  async finishWebAuthnRegistration(
    identifier: string,
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
      var data = CredentialToServerCredentialCreation(credential);
      data = {
        ...data,
        origin: origin,
      };
      var path = "/webauthn/register/finish";
      var resp = await axios.post(
        `${CotterEnum.BackendURL}${path}?identifier=${encodeURIComponent(
          identifier
        )}`,
        data,
        config
      );
      return resp.data;
    } catch (err) {
      if (err.response) {
        throw err.response.data;
      }
      throw err;
    }
  }

  // begin webauthn login, grab options from the backend
  // regarding allowed authenticator algorithms etc.
  async beginWebAuthnLogin(
    identifier: string,
    origin: string
  ): Promise<PublicKeyCredentialRequestOptions> {
    try {
      var config = {
        headers: {
          API_KEY_ID: this.apiKeyID,
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      var data = {
        origin: origin,
      };
      const path = "/webauthn/login/begin";
      var resp = await axios.post(
        `${CotterEnum.BackendURL}${path}?identifier=${encodeURIComponent(
          identifier
        )}`,
        data,
        config
      );
      if (resp.data && resp.data.publicKey) {
        return serverToRequestOptions(resp.data.publicKey);
      }
      throw resp;
    } catch (err) {
      if (err.response) {
        throw err.response.data;
      }
      throw err;
    }
  }

  // Validate user's webauthn credentials
  async finishWebAuthnLogin(
    identifier: string,
    identifierType: string,
    credential: any,
    origin: string,
    publicKey: string
  ): Promise<any> {
    try {
      var config = {
        headers: {
          API_KEY_ID: this.apiKeyID,
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      var data = CredentialToServerCredentialRequest(credential);
      data = {
        ...data,
        origin: origin,
        public_key: publicKey,
        identifier_type: identifierType,
        device_type: "BROWSER",
        device_name: navigator.userAgent,
      };
      var path = "/webauthn/login/finish";
      var resp = await axios.post(
        `${CotterEnum.BackendURL}${path}?identifier=${encodeURIComponent(
          identifier
        )}`,
        data,
        config
      );
      return resp.data;
    } catch (err) {
      if (err.response) {
        throw err.response.data;
      }
      throw err;
    }
  }

  // =====================
  //      Social Login
  // =====================
  async loginAndConnect(
    tokenID: string,
    userID: string,
    provider: any
  ): Promise<any> {
    try {
      var config = {
        headers: {
          API_KEY_ID: this.apiKeyID,
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      const data = {
        token_id: tokenID,
        user_id: userID,
        identity_provider: provider,
      };
      try {
        const loginStateSess = sessionStorage.getItem(
          SocialLogin.OAUTH_SESSION_NAME
        );
        data["login_state"] = JSON.parse(atob(loginStateSess));
      } catch (e) {}
      var path = "/oauth/token/connect";
      var resp = await axios.post(
        `${CotterEnum.BackendURL}${path}`,
        data,
        config
      );
      return resp.data;
    } catch (err) {
      if (err.response) {
        throw err.response.data;
      }
      throw err;
    }
  }

  // ==============================
  //      Loader Company Info
  // ==============================
  async getInfo() {
    try {
      var resp = await axios.get(
        `${CotterEnum.BackendURL}/company/info/${this.apiKeyID}`,
        null
      );
      return resp.data;
    } catch (err) {
      if (err.response) {
        throw err.response.data;
      }
      throw err;
    }
  }
}

export default API;

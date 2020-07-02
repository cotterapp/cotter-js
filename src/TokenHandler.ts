import { CotterAccessToken, CotterIDToken } from "cotter-token-js";
import API from "./API";

export interface OAuthToken {
  access_token: string;
  id_token: string;
  token_type: string;
  refresh_token: string;
}

class TokenHandler {
  accessToken: string | undefined;
  idToken: string | undefined;
  tokenType: string | undefined;
  apiKeyID: string;

  constructor(apiKeyID: string) {
    this.apiKeyID = apiKeyID;
  }

  storeTokens(oauthTokens: OAuthToken) {
    console.log("Storing Tokens");
    if (oauthTokens === null || oauthTokens === undefined) {
      throw new Error("oauthTokens are not specified (null or undefined)");
    }
    this.accessToken = oauthTokens.access_token;
    this.idToken = oauthTokens.id_token;
    this.tokenType = oauthTokens.token_type;
  }

  async getAccessToken(): Promise<CotterAccessToken | null> {
    var accessToken = this.accessToken;

    var accessTok = null;
    if (accessToken && accessToken.length > 0) {
      accessTok = new CotterAccessToken(accessToken);
    }

    // if Access token already expired: refetch new token
    if (
      accessToken == undefined ||
      accessTok == null ||
      accessTok.getExpiration() < new Date().getTime() / 1000
    ) {
      try {
        var resp = await this.getTokensFromRefreshToken();
      } catch (err) {
        // No refresh token in cookie or some other error
        return null;
      }
      accessToken = resp.access_token;
    }
    this.accessToken = accessToken;
    return new CotterAccessToken(accessToken);
  }

  async getIDToken(): Promise<CotterIDToken | null> {
    var idToken = this.idToken;

    var idTok = null;
    if (idToken && idToken.length > 0) {
      idTok = new CotterIDToken(idToken);
    }

    // if ID token already expired: refetch new token
    if (
      idToken == undefined ||
      idTok == null ||
      idTok.getExpiration() < new Date().getTime() / 1000
    ) {
      try {
        var resp = await this.getTokensFromRefreshToken();
      } catch (err) {
        // No refresh token in cookie or some other error
        return null;
      }
      idToken = resp.id_token;
    }
    this.idToken = idToken;
    return new CotterIDToken(idToken);
  }

  // Returns access token
  async getTokensFromRefreshToken(): Promise<OAuthToken> {
    console.log("Refreshing token");
    try {
      var api = new API(this.apiKeyID);
      var resp = await api.getTokensFromRefreshToken();
      this.storeTokens(resp);
      return resp;
    } catch (err) {
      throw err;
    }
  }

  // Clear all access token
  async removeTokens() {
    this.accessToken = undefined;
    this.idToken = undefined;
    this.tokenType = undefined;
    var api = new API(this.apiKeyID);
    try {
      await api.removeRefreshToken();
    } catch (err) {
      throw err;
    }
  }
}

export default TokenHandler;

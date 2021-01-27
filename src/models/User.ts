import Cotter from "../Cotter";
import WebAuthn from "../WebAuthn";
import UserHandler, { IUser } from "../handler/UserHandler";

class User implements IUser {
  ID: string;
  issuer: string;
  client_user_id: string;
  enrolled: string[];
  identifier: string;
  cotter: Cotter | undefined;

  constructor(user: IUser) {
    this.ID = user.ID;
    this.issuer = user.issuer;
    this.client_user_id = user.client_user_id;
    this.enrolled = user.enrolled;
    this.identifier = user.identifier;
  }

  update(user: IUser) {
    this.ID = user.ID;
    this.issuer = user.issuer;
    this.client_user_id = user.client_user_id;
    this.enrolled = user.enrolled;
    this.identifier = user.identifier;
  }

  static getLoggedInUser(): User | null {
    var userStr = null;
    try {
      userStr = localStorage.getItem(UserHandler.STORAGE_KEY);
    } catch (e) {}
    if (userStr) {
      var userJson = JSON.parse(userStr);
      var user = new User(userJson);
      return user;
    }
    return null;
  }

  async registerWebAuthn() {
    const available = await WebAuthn.available();
    if (!available) {
      let web = new WebAuthn({
        WebAuthnEnabled: true,
        RegisterWebAuthn: true,
        ApiKeyID: this.issuer,
        Identifier: this.identifier,
        Type: "REGISTRATION",
        ErrorDisplay: "The browser or user device doesn't support WebAuthn.",
      });
      return await web.show();
    }
    let web = new WebAuthn({
      ApiKeyID: this.issuer,
      Identifier: this.identifier,
      Type: "REGISTRATION",
      RegisterWebAuthn: true,
    });
    return await web.show();
  }
}

export default User;

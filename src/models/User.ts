import Cotter from "../Cotter";
import WebAuthn from "../WebAuthn";

export interface IUser {
  ID: string;
  issuer: string;
  clientUserID: string;
  enrolled: string[];
  identifier: string;
}

class User implements IUser {
  static STORAGE_KEY = "COTTER_USER";
  ID: string;
  issuer: string;
  clientUserID: string;
  enrolled: string[];
  identifier: string;
  cotter: Cotter | undefined;

  constructor(user: IUser) {
    this.ID = user.ID;
    this.issuer = user.issuer;
    this.clientUserID = user.clientUserID;
    this.enrolled = user.enrolled;
    this.identifier = user.identifier;
  }

  update(user: IUser) {
    this.ID = user.ID;
    this.issuer = user.issuer;
    this.clientUserID = user.clientUserID;
    this.enrolled = user.enrolled;
    this.identifier = user.identifier;
  }

  withCotter(cotter: Cotter): User {
    this.cotter = cotter;
    return this;
  }

  store() {
    localStorage.setItem(User.STORAGE_KEY, JSON.stringify(this));
  }

  static getLoggedInUser(cotter: Cotter): User | null {
    var userStr = localStorage.getItem(User.STORAGE_KEY);
    if (userStr) {
      var userJson = JSON.parse(userStr);
      var user = new User(userJson);
      user.withCotter(cotter);
      return user;
    }
    return null;
  }

  async registerWebAuthn() {
    // let web = new WebAuthn(this.issuer);
    // try {
    //   let resp = await web.beginRegistration(this.ID);
    //   // Update user object
    //   this.update(resp);
    //   this.store();
    // } catch (err) {
    //   throw err;
    // }
  }
}

export default User;

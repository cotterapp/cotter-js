export interface IUser {
  ID: string;
  issuer: string;
  client_user_id: string;
  enrolled: string[];
  identifier: string;
}

export default class UserHandler {
  static STORAGE_KEY = "COTTER_USER";
  static store(user: IUser) {
    localStorage.setItem(UserHandler.STORAGE_KEY, JSON.stringify(user));
  }
  static remove() {
    localStorage.removeItem(UserHandler.STORAGE_KEY);
  }
}

export interface IUser {
    ID: string;
    issuer: string;
    client_user_id: string;
    enrolled: string[];
    identifier: string;
}
export default class UserHandler {
    static STORAGE_KEY: string;
    static store(user: IUser): void;
    static remove(): void;
}

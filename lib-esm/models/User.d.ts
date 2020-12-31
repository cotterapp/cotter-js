import Cotter from "../Cotter";
import { IUser } from "../handler/UserHandler";
declare class User implements IUser {
    ID: string;
    issuer: string;
    client_user_id: string;
    enrolled: string[];
    identifier: string;
    cotter: Cotter | undefined;
    constructor(user: IUser);
    update(user: IUser): void;
    static getLoggedInUser(): User | null;
    registerWebAuthn(): Promise<import("../binder").VerifySuccess>;
}
export default User;

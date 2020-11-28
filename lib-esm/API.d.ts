import { OAuthToken } from "./handler/TokenHandler";
declare class API {
    apiKeyID: string;
    constructor(apiKeyID: string);
    getTokensFromRefreshToken(refreshToken: string | null): Promise<OAuthToken>;
    removeRefreshToken(): Promise<any>;
    checkCredentialExist(identifier: string): Promise<boolean>;
    beginWebAuthnRegistration(identifier: string, origin: string): Promise<PublicKeyCredentialCreationOptions>;
    finishWebAuthnRegistration(identifier: string, credential: any, origin: string): Promise<any>;
    beginWebAuthnLogin(identifier: string, origin: string): Promise<PublicKeyCredentialRequestOptions>;
    finishWebAuthnLogin(identifier: string, identifierType: string, credential: any, origin: string, publicKey: string): Promise<any>;
    loginAndConnect(tokenID: string, userID: string, provider: any): Promise<any>;
    getInfo(): Promise<any>;
}
export default API;

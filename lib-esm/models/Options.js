var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { base64urlencode, base64urldecode } from "../helper";
export function serverToCreationOptions(options) {
    var formattedExcludeCred = options.excludeCredentials
        ? options.excludeCredentials.map(function (item) { return (__assign(__assign({}, item), { id: base64urldecode(item.id) })); })
        : undefined;
    var opts = __assign(__assign({}, options), { challenge: base64urldecode(options.challenge), user: __assign(__assign({}, options.user), { id: base64urldecode(options.user.id) }), excludeCredentials: formattedExcludeCred });
    return opts;
}
export function serverToRequestOptions(options) {
    var formattedAllowCred = options.allowCredentials
        ? options.allowCredentials.map(function (item) { return (__assign(__assign({}, item), { id: base64urldecode(item.id) })); })
        : undefined;
    var opts = __assign(__assign({}, options), { challenge: base64urldecode(options.challenge), allowCredentials: formattedAllowCred });
    return opts;
}
export function CredentialToServerCredentialCreation(credential) {
    return {
        id: credential.id,
        rawId: base64urlencode(credential.rawId),
        response: {
            clientDataJSON: base64urlencode(credential.response.clientDataJSON),
            attestationObject: base64urlencode(credential.response.attestationObject),
        },
        type: credential.type,
    };
}
export function CredentialToServerCredentialRequest(credential) {
    return {
        id: credential.id,
        rawId: base64urlencode(credential.rawId),
        response: {
            authenticatorData: base64urlencode(credential.response.authenticatorData),
            clientDataJSON: base64urlencode(credential.response.clientDataJSON),
            signature: base64urlencode(credential.response.signature),
            userHandle: base64urlencode(credential.response.userHandle),
        },
        type: credential.type,
    };
}
// interface CredentialParameter {
//   type: string;
//   alg: number;
// }
// interface AuthenticatorSelection {
//   authenticatorAttachment: string;
//   requireResidentKey: boolean | null;
//   userVerification: string;
// }
// interface CredentialDescriptor {
//   type: string;
//   id: Int8Array;
//   transports: string[];
// }
//# sourceMappingURL=Options.js.map
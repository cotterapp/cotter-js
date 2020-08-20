"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialToServerCredentialRequest = exports.CredentialToServerCredentialCreation = exports.serverToRequestOptions = exports.serverToCreationOptions = void 0;
var helper_1 = require("../helper");
function serverToCreationOptions(options) {
    var formattedExcludeCred = options.excludeCredentials
        ? options.excludeCredentials.map(function (item) { return (__assign(__assign({}, item), { id: helper_1.base64urldecode(item.id) })); })
        : undefined;
    var opts = __assign(__assign({}, options), { challenge: helper_1.base64urldecode(options.challenge), user: __assign(__assign({}, options.user), { id: helper_1.base64urldecode(options.user.id) }), excludeCredentials: formattedExcludeCred });
    return opts;
}
exports.serverToCreationOptions = serverToCreationOptions;
function serverToRequestOptions(options) {
    var formattedAllowCred = options.allowCredentials
        ? options.allowCredentials.map(function (item) { return (__assign(__assign({}, item), { id: helper_1.base64urldecode(item.id) })); })
        : undefined;
    var opts = __assign(__assign({}, options), { challenge: helper_1.base64urldecode(options.challenge), allowCredentials: formattedAllowCred });
    return opts;
}
exports.serverToRequestOptions = serverToRequestOptions;
function CredentialToServerCredentialCreation(credential) {
    return {
        id: credential.id,
        rawId: helper_1.base64urlencode(credential.rawId),
        response: {
            clientDataJSON: helper_1.base64urlencode(credential.response.clientDataJSON),
            attestationObject: helper_1.base64urlencode(credential.response.attestationObject),
        },
        type: credential.type,
    };
}
exports.CredentialToServerCredentialCreation = CredentialToServerCredentialCreation;
function CredentialToServerCredentialRequest(credential) {
    return {
        id: credential.id,
        rawId: helper_1.base64urlencode(credential.rawId),
        response: {
            authenticatorData: helper_1.base64urlencode(credential.response.authenticatorData),
            clientDataJSON: helper_1.base64urlencode(credential.response.clientDataJSON),
            signature: helper_1.base64urlencode(credential.response.signature),
            userHandle: helper_1.base64urlencode(credential.response.userHandle),
        },
        type: credential.type,
    };
}
exports.CredentialToServerCredentialRequest = CredentialToServerCredentialRequest;
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
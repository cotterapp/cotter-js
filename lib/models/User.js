"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var WebAuthn_1 = __importDefault(require("../WebAuthn"));
var UserHandler_1 = __importDefault(require("../handler/UserHandler"));
var User = /** @class */ (function () {
    function User(user) {
        this.ID = user.ID;
        this.issuer = user.issuer;
        this.client_user_id = user.client_user_id;
        this.enrolled = user.enrolled;
        this.identifier = user.identifier;
    }
    User.prototype.update = function (user) {
        this.ID = user.ID;
        this.issuer = user.issuer;
        this.client_user_id = user.client_user_id;
        this.enrolled = user.enrolled;
        this.identifier = user.identifier;
    };
    User.getLoggedInUser = function () {
        var userStr = null;
        try {
            userStr = localStorage.getItem(UserHandler_1.default.STORAGE_KEY);
        }
        catch (e) { }
        if (userStr) {
            var userJson = JSON.parse(userStr);
            var user = new User(userJson);
            return user;
        }
        return null;
    };
    User.prototype.registerWebAuthn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var available, web_1, web;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WebAuthn_1.default.available()];
                    case 1:
                        available = _a.sent();
                        if (!!available) return [3 /*break*/, 3];
                        web_1 = new WebAuthn_1.default({
                            WebAuthnEnabled: true,
                            RegisterWebAuthn: true,
                            ApiKeyID: this.issuer,
                            Identifier: this.identifier,
                            Type: "REGISTRATION",
                            ErrorDisplay: "The browser or user device doesn't support WebAuthn.",
                        });
                        return [4 /*yield*/, web_1.show()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        web = new WebAuthn_1.default({
                            ApiKeyID: this.issuer,
                            Identifier: this.identifier,
                            Type: "REGISTRATION",
                            RegisterWebAuthn: true,
                        });
                        return [4 /*yield*/, web.show()];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return User;
}());
exports.default = User;
//# sourceMappingURL=User.js.map
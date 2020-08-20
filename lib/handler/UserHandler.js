"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserHandler = /** @class */ (function () {
    function UserHandler() {
    }
    UserHandler.store = function (user) {
        localStorage.setItem(UserHandler.STORAGE_KEY, JSON.stringify(user));
    };
    UserHandler.remove = function () {
        localStorage.removeItem(UserHandler.STORAGE_KEY);
    };
    UserHandler.STORAGE_KEY = "COTTER_USER";
    return UserHandler;
}());
exports.default = UserHandler;
//# sourceMappingURL=UserHandler.js.map
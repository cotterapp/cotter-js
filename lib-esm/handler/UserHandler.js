var UserHandler = /** @class */ (function () {
    function UserHandler() {
    }
    UserHandler.store = function (user) {
        try {
            localStorage.setItem(UserHandler.STORAGE_KEY, JSON.stringify(user));
        }
        catch (e) { }
    };
    UserHandler.remove = function () {
        try {
            localStorage.removeItem(UserHandler.STORAGE_KEY);
        }
        catch (e) { }
    };
    UserHandler.STORAGE_KEY = "COTTER_USER";
    return UserHandler;
}());
export default UserHandler;
//# sourceMappingURL=UserHandler.js.map
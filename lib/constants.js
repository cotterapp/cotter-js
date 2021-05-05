"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGOUT_BUTTON_HREF = exports.DIV_CONTAINER = exports.POPUP_BUTTON_HREF = exports.DEFAULT_FORM_SETTINGS = exports.ATTR_CONFIG = exports.ATTR_ENV = exports.ATTR_API_KEY_ID = void 0;
var binder_1 = require("./binder");
exports.ATTR_API_KEY_ID = "data-cotter-api-key-id";
exports.ATTR_ENV = "data-cotter-env";
exports.ATTR_CONFIG = "data-cotter-config";
exports.DEFAULT_FORM_SETTINGS = {
    authenticationMethod: binder_1.AUTHENTICATION_METHOD.MAGIC_LINK,
    type: binder_1.IDENTIFIER_TYPE.EMAIL,
    modalBackgroundColor: "#ffffff",
    modalTitleColor: "#2e2e2e",
    modalTitle: "Welcome",
    logo: "https://www.cotter.app/assets/cotter_logo.png",
};
exports.POPUP_BUTTON_HREF = "#/ct/login/";
exports.DIV_CONTAINER = "cotter-form-container-";
exports.LOGOUT_BUTTON_HREF = "#/ct/logout/";
//# sourceMappingURL=constants.js.map
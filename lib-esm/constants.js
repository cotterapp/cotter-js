import { AUTHENTICATION_METHOD, IDENTIFIER_TYPE } from "./binder";
export var ATTR_API_KEY_ID = "data-cotter-api-key-id";
export var ATTR_ENV = "data-cotter-env";
export var ATTR_CONFIG = "data-cotter-config";
export var DEFAULT_FORM_SETTINGS = {
    authenticationMethod: AUTHENTICATION_METHOD.MAGIC_LINK,
    type: IDENTIFIER_TYPE.EMAIL,
    modalBackgroundColor: "#ffffff",
    modalTitleColor: "#2e2e2e",
    modalTitle: "Welcome",
    logo: "https://www.cotter.app/assets/cotter_logo.png",
};
export var POPUP_BUTTON_HREF = "#/ct/login/";
export var DIV_CONTAINER = "cotter-form-container-";
export var LOGOUT_BUTTON_HREF = "#/ct/logout/";
//# sourceMappingURL=constants.js.map
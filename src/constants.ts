import { AUTHENTICATION_METHOD, IDENTIFIER_TYPE } from "./binder";

export const ATTR_API_KEY_ID = "data-cotter-api-key-id";
export const ATTR_ENV = "data-cotter-env";
export const DEFAULT_FORM_SETTINGS = {
  authenticationMethod: AUTHENTICATION_METHOD.MAGIC_LINK,
  type: IDENTIFIER_TYPE.EMAIL,
  modalBackgroundColor: "#ffffff",
  modalTitleColor: "#2e2e2e",
  modalTitle: "Welcome",
  logo: "https://www.cotter.app/assets/cotter_logo.png",
};
export const POPUP_BUTTON_HREF = "#/ct/login/";
export const DIV_CONTAINER = "cotter-form-container-";

export const LOGOUT_BUTTON_HREF = "#/ct/logout/";

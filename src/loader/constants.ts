import { AUTHENTICATION_METHOD, IDENTIFIER_TYPE } from "../binder";

export const ATTR_API_KEY_ID = "data-cotter-api-key-id";
export const ATTR_ENV = "data-cotter-env";
export const DEFAULT_FORM_SETTINGS = {
  authenticationMethod: AUTHENTICATION_METHOD.MAGIC_LINK,
  type: IDENTIFIER_TYPE.EMAIL,
};
export const POPUP_BUTTON_HREF = "#/ct/login/";

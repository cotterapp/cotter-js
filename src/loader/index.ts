import API from "../API";
import { AUTHENTICATION_METHOD, IDENTIFIER_TYPE } from "../binder";
import Cotter from "../Cotter";
import {
  ATTR_API_KEY_ID,
  ATTR_ENV,
  DEFAULT_FORM_SETTINGS,
  POPUP_BUTTON_HREF,
} from "./constants";
import ModalMakerNoIframe from "../components/ModalMakerNoIframe";
import CotterEnum from "../enum";

class Loader {
  static ApiKeyID: string;
  static companyInfo: any;
  static buttons: Array<any> = [];

  static Modals: { [formID: string]: ModalMakerNoIframe } = {};
  static modalID: "cotter-modal";
  static containerID: "cotter-modal-form-container";
  static cancelDivID: "cotter-modal-cancel";

  static async init() {
    console.log("Loader Init");
    var apiKeyID = document
      .querySelector(`[${ATTR_API_KEY_ID}]`)
      ?.getAttribute(`${ATTR_API_KEY_ID}`);
    if (!apiKeyID) {
      throw new Error(
        `You need to specify the ${ATTR_API_KEY_ID} when adding this <script>.`
      );
    }
    this.ApiKeyID = apiKeyID;

    // Get environment to use
    var env = document
      .querySelector(`[${ATTR_ENV}]`)
      ?.getAttribute(`${ATTR_ENV}`);
    if (env === "DEV") {
      CotterEnum.BackendURL = "http://localhost:1234/api/v0";
      CotterEnum.JSURL = "http://localhost:3000";
      CotterEnum.AssetURL = "http://localhost:3000";
    } else if (env === "STAGING") {
      CotterEnum.BackendURL = "https://staging.cotter.app/api/v0";
      CotterEnum.JSURL = "https://s.js.cotter.app";
      CotterEnum.AssetURL = "https://s.js.cotter.app";
    }

    // Get company info and customization
    const api = new API(this.ApiKeyID);
    let companyInfo;
    try {
      companyInfo = await api.getInfo();
      this.companyInfo = companyInfo;
    } catch (e) {
      throw new Error(`Fail fetching company info for ${this.ApiKeyID}`);
    }

    // Get all buttons that opens the login modal
    Array.from(
      document.querySelectorAll(`[href*='${POPUP_BUTTON_HREF}']`)
    ).forEach((e) => {
      var href = e.getAttribute("href");
      console.log("Array href", href);
      var formID = href?.split(POPUP_BUTTON_HREF).pop() || null;
      if (formID) {
        this.initModal(formID);
        let self = this;
        e.addEventListener("click", function () {
          if (formID) {
            self.Modals[formID].showModal();
          }
        });
        this.buttons.push(e);
      }
    });
  }

  static async initModal(formID: string) {
    const modalID = `${this.modalID}-${formID}`;
    const containerID = `${this.containerID}-${formID}`;
    const cancelDivID = `${this.cancelDivID}-${formID}`;
    // Init Modal
    const modal = new ModalMakerNoIframe(modalID, containerID, cancelDivID);
    const modalDiv = `
    <div class="modal__overlay" tabindex="-1" id="${cancelDivID}" >
      <div id="modal-container" class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-cotterWebAuthn-title">
        <div id="modal-content-content" class="modal-content-content modal__container-webAuthn">
          <div id="modal-content" class="modal__content modal__content-webAuthn" >
            <div id="${containerID}" class="modal-frame-webAuthn"></div>
          </div>
        </div>
        <div class="cotter-watermark" style="margin-top: 10px">
          <div class="title is-6" style="color: #ffffff"> Secured by </div>
          <img src="${CotterEnum.AssetURL}/assets/images/cotter_transparent_light.png" class="cotter-logo" style="width: 30px; height: 30px;"/>
          <div class="title is-6" style="color: #ffffff"> Cotter </div>
        </div>
      </div>
    </div>
    `;
    modal.initModal(() => {}, modalDiv);
    this.Modals[formID] = modal;
    this.initCotterForModal(formID, containerID);
  }

  static async initCotterForModal(formID: string, containerID: string) {
    var container = document.getElementById(containerID);
    if (!container) {
      let self = this;
      setTimeout(() => self.initCotterForModal(formID, containerID), 10);
    }

    // Container on modal is loaded!
    // Get form info based on form ID
    const customization =
      this.companyInfo?.customization &&
      this.companyInfo?.customization[formID];
    console.log("customization", customization);
    const idType = customization?.type || DEFAULT_FORM_SETTINGS.type;
    const authMethod =
      customization.authenticationMethod ||
      DEFAULT_FORM_SETTINGS.authenticationMethod;
    let cotter = new Cotter({
      ApiKeyID: this.ApiKeyID,
      ContainerID: containerID,
      Type: idType,
    });
    cotter = cotter.withFormID(formID);
    const cotterMethod =
      authMethod === AUTHENTICATION_METHOD.OTP
        ? cotter.signInWithOTP()
        : cotter.signInWithLink();
    const cotterType =
      idType === IDENTIFIER_TYPE.PHONE
        ? cotterMethod.showPhoneForm()
        : cotterMethod.showEmailForm();
    cotterType
      .then((resp) => {
        console.log(resp);
        if (customization.afterLoginURL) {
          window.location.href = customization.afterLoginURL;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Loader.init();
});

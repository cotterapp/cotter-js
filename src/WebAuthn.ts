import { Config } from "./binder";
import TokenHandler from "./handler/TokenHandler";
import MicroModal, { Modal } from "./components/MicroModal";
import CotterEnum from "./enum";
import { isIFrame, verificationProccessPromise } from "./helper";
import API from "./API";
import UserHandler from "./handler/UserHandler";

const defaultWebAuthnRegistrationText = {
  title: "Sign-in faster.",
  subtitle: "Setup {{method}} to sign-in faster the next time you log in.",
  button: "Enable {{method}}",
  buttonSkip: "Setup Later",
  waiting: "Please wait for the browser pop up",
  theme: "#7d44fa",
};

const defaultWebAuthnLoginText = {
  title: "Sign in with {{method}}.",
  subtitle: "Authenticate with {{method}} from your device.",
  buttonSkip: "Send {{alternative}} to {{identifier}} instead.",
  button: "Sign in with {{method}}",
  waiting: "Please wait for the browser pop up",
  theme: "#7d44fa",
};
class WebAuthn {
  static CANCELED = "CANCELED";
  static SUCCESS = "SUCCESS";

  config: Config;
  loaded: boolean;
  cotterIframeID: string;
  containerID: string;
  cancelDivID: string;

  state: string | null;
  verifyError?: any;
  verifySuccess?: any;
  tokenHander?: TokenHandler;
  originalResponse?: any;
  displayedError?: string;
  activeModal?: Modal | null;

  // config needs:
  // - ApiKeyID
  // - Identifier
  constructor(config: Config, tokenHandler?: TokenHandler) {
    this.config = config || {};

    // These are not directly called by client, so client can't set customization in code
    this.config.RegistrationText = defaultWebAuthnRegistrationText;
    this.config.LoginText = defaultWebAuthnLoginText;

    this.loaded = false;

    // storing access token
    this.tokenHander = tokenHandler;

    this.originalResponse = this.config.OriginalResponse;
    if (this.config.ErrorDisplay) {
      this.displayedError = this.config.ErrorDisplay;
    }

    this.state = localStorage.getItem("COTTER_STATE");
    if (!localStorage.getItem("COTTER_STATE")) {
      this.state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("COTTER_STATE", this.state);
    }

    this.config.Domain = new URL(window.location.href).origin;

    if (!this.config.CotterBackendURL) {
      this.config.CotterBackendURL = CotterEnum.BackendURL;
    }

    // Setup div and iframe ids
    this.cotterIframeID =
      Math.random().toString(36).substring(2, 15) + "cotter-webauthn-iframe";
    this.containerID =
      Math.random().toString(36).substring(2, 15) + "cotter-webauthn-container";
    this.cancelDivID = "modal-cotterWebAuthn-close-form";
    this.init();
  }
  init() {
    // Setup Font
    var fontStyle = document.createElement("link");
    fontStyle.rel = "stylesheet";
    fontStyle.href =
      "https://fonts.googleapis.com/css?family=Lato:700&display=swap";
    document.head.appendChild(fontStyle);

    var modalStyle = document.createElement("link");
    modalStyle.rel = "stylesheet";
    modalStyle.href = `${CotterEnum.AssetURL}/lib/modal.css`;
    document.head.appendChild(modalStyle);

    var div = document.createElement("div");
    div.className = "modal micromodal-slide";
    div.id = "modal-cotterWebAuthn";
    var att = document.createAttribute("aria-hidden");
    att.value = "true";
    div.setAttributeNode(att);

    const modalDiv = `
    <div class="modal__overlay" tabindex="-1" id="${this.cancelDivID}" >
      <div id="modal-container" class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-cotterWebAuthn-title">
        <div id="modal-content-content" class="modal-content-content modal__container-webAuthn">
          <div id="modal-content" class="modal__content modal__content-webAuthn" >
            <div id="${this.containerID}" class="modal-frame-webAuthn"></div>
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
    div.innerHTML = modalDiv;
    document.body.appendChild(div);

    // set close form for cotter modal
    let closeDiv = document.getElementById(this.cancelDivID);
    if (closeDiv) {
      closeDiv.onclick = () => {
        this.cancel();
      };
    }

    // Load modal
    MicroModal.init({
      awaitOpenAnimation: true, // [8]
      awaitCloseAnimation: true, // [9]
    });

    this.initEventHandler();
  }

  removeSelf() {
    let cotterWebAuthn = document.getElementById("modal-cotterWebAuthn");
    if (cotterWebAuthn) cotterWebAuthn.remove();
  }

  onSuccess(data: any, status = WebAuthn.SUCCESS) {
    this.close();
    this.verifySuccess = {
      status: status,
      ...data,
    };
  }

  onError(error: any) {
    this.close();
    this.verifyError = error;
  }
  onErrorDisplay(error: any) {
    var err = error;
    if (error.data && error.data.msg) {
      err = error.data.msg;
    }
    err = err.toString();
    if (err.includes("timed out")) {
      err = "The operation either timed out or was not allowed.";
    } else if (err.includes("already pending")) {
      err = "A request is already pending.";
    } else if (err.includes("credentials already registered")) {
      err =
        "You already registered this authenticator, you don't have to register it again.";
    }
    this.displayedError = err;
    var postData = {
      action: "ERROR_DISPLAY",
      payload: {
        error: err,
      },
    };
    WebAuthn.sendPost(postData, this.cotterIframeID);
  }

  initEventHandler() {
    window.addEventListener("message", (e) => {
      try {
        var data = JSON.parse(e.data);
      } catch (e) {
        // skip in case the data is not JSON formatted
        return;
      }
      // there are some additional messages that shouldn't be handled by this
      // listener, such as messages from https://js.stripe.com/
      if (e.origin !== CotterEnum.JSURL) {
        // skip this message
        return;
      }
      let cID = this.containerID;
      console.log(cID, data);
      switch (data.callbackName) {
        case cID + "FIRST_LOAD":
          var postData = {
            action: "CONFIG",
            payload: {
              registrationText: this.config.RegistrationText,
              loginText: this.config.LoginText,
              alternativeMethod: this.config.AlternativeMethod,
              identifier: this.config.Identifier,
              errorDisplay: this.config.ErrorDisplay,
            },
          };
          WebAuthn.sendPost(postData, this.cotterIframeID);
          break;
        case cID + "LOADED":
          this.loaded = true;
          break;
        case cID + "BEGIN_WEBAUTHN_REGISTRATION":
          this.beginRegistration(
            this.config.Identifier || "",
            this.config.Domain || new URL(window.location.href).origin
          )
            .then((resp) => this.onSuccess(resp))
            .catch((err) => this.onErrorDisplay(err));
          break;
        case cID + "SKIP_WEBAUTHN":
          this.cancel();
          break;
        case cID + "BEGIN_WEBAUTHN_LOGIN":
          this.beginLogin(
            this.config.Identifier || "",
            this.config.Domain || new URL(window.location.href).origin,
            data.payload.publicKey
          )
            .then((resp) => this.onSuccess(resp))
            .catch((err) => this.onErrorDisplay(err));
          break;
        case cID + "ON_SUCCESS":
          this.onSuccess(data.payload);
          break;
        case cID + "ON_ERROR":
          this.onError(data.payload);
          break;
        default:
          break;
      }
    });
  }

  static sendPost(data: object, iframeID: string) {
    var ifrm = document.getElementById(iframeID);
    if (isIFrame(ifrm) && ifrm.contentWindow) {
      ifrm.contentWindow.postMessage(JSON.stringify(data), CotterEnum.JSURL);
    }
  }

  loadIframe() {
    const containerID = this.containerID;
    var container = document.getElementById(containerID);
    if (container) {
    }

    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("id", this.cotterIframeID);
    ifrm.style.border = "0";
    container!.appendChild(ifrm);
    ifrm.style.width = "100%";
    ifrm.style.height = "100%";
    if (this.config.CaptchaRequired) {
      ifrm.style.minHeight = "520px";
    }
    ifrm.style.overflow = "scroll";

    var path = `${CotterEnum.JSURL}/webauthn?type=${this.config.Type}&domain=${this.config.Domain}&api_key=${this.config.ApiKeyID}&state=${this.state}&id=${this.containerID}&identifier=${this.config.Identifier}`;
    ifrm.setAttribute("src", encodeURI(path));
    ifrm.setAttribute("allowtransparency", "true");
  }

  removeIframe() {
    var ifrm = document.getElementById(this.cotterIframeID);
    ifrm!.remove();
  }

  async show() {
    try {
      this.activeModal = MicroModal.show("modal-cotterWebAuthn", {});
    } catch (e) {
      if (e instanceof TypeError) {
        let self = this;
        setTimeout(() => self.show(), 0);
      } else {
        console.error(e);
      }
    } finally {
      this.loadIframe(); // setup iframe
    }

    return verificationProccessPromise(this);
  }

  cancel() {
    if (
      this.displayedError !== null &&
      this.displayedError !== undefined &&
      this.config.RegisterWebAuthn
    ) {
      this.onError(this.displayedError);
      return;
    }
    this.onSuccess(this.originalResponse, WebAuthn.CANCELED);
  }

  close() {
    if (this.activeModal)
      this.activeModal.closeModalById("modal-cotterWebAuthn");
    else MicroModal.close("modal-cotterWebAuthn");
    this.removeIframe();
    this.removeSelf();
  }

  // Opening Registration
  startRegistration() {
    this.config.Type = "REGISTRATION";
    this.show();
  }
  startLogin() {
    this.config.Type = "LOGIN";
    this.show();
  }

  // ===========================================
  //          WEBAUTHN FUNCTIONALITIES
  // ===========================================

  // ============== CHECK WEBAUTHN EXISTS ===============
  static async available() {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  // ============== REGISTER WEBAUTHN ===============

  async beginRegistration(identifier: string, origin: string) {
    let api = new API(this.config.ApiKeyID);
    let options = await api.beginWebAuthnRegistration(identifier, origin);

    let available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!available) {
      throw "The browser or user device doesn't support WebAuthn.";
    }
    try {
      const credential = await navigator.credentials.create({
        publicKey: options,
      });
      if (!credential) {
        throw "Unable to create credential";
      }
      return await this.finishRegistration(credential, identifier, origin);
    } catch (err) {
      throw err;
    }
  }

  async finishRegistration(
    credential: Credential,
    identifier: string,
    origin: string
  ) {
    try {
      let api = new API(this.config.ApiKeyID);
      let resp = await api.finishWebAuthnRegistration(
        identifier,
        credential,
        origin
      );
      resp[this.config.IdentifierField || ""] = resp.user.identifier;
      return resp;
    } catch (err) {
      throw err;
    }
  }

  async beginLogin(identifier: string, origin: string, publicKey: string) {
    let api = new API(this.config.ApiKeyID);
    let options = await api.beginWebAuthnLogin(identifier, origin);

    let available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!available) {
      throw "The browser or user device doesn't support WebAuthn.";
    }
    try {
      const credential = await navigator.credentials.get({
        publicKey: options,
      });
      if (!credential) {
        throw "Unable to create credential";
      }
      return await this.finishLogin(credential, identifier, origin, publicKey);
    } catch (err) {
      throw err;
    }
  }

  async finishLogin(
    credential: Credential,
    identifier: string,
    origin: string,
    publicKey: string
  ) {
    try {
      let api = new API(this.config.ApiKeyID);
      let resp = await api.finishWebAuthnLogin(
        identifier,
        this.config.IdentifierType || "EMAIL",
        credential,
        origin,
        publicKey
      );

      console.log("User store", resp);
      if (resp && resp.user) {
        UserHandler.store(resp.user);
      }
      if (resp && resp.oauth_token && this.tokenHander) {
        this.tokenHander.storeTokens(resp.oauth_token);
      }
      resp[this.config.IdentifierField || ""] = resp.user.identifier;
      return resp;
    } catch (err) {
      throw err;
    }
  }
}
export default WebAuthn;

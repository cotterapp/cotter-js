import CotterEnum from "./enum";
import { isIFrame, verificationProccessPromise } from "./helper";
import { Config, SocialLoginProviders, SOCIAL_LOGIN_ACTION } from "./binder";
import ModalMaker from "./components/ModalMaker";
import API from "./API";

const defaultSocialConnectText = {
  title: "Do you want to link these accounts?",
  subtitle:
    "You are logging-in with an email or phone that is already associated with an existing account",
  button: "Link",
  buttonSkip: "Cancel",
  theme: "#7d44fa",
};

class SocialLogin {
  static LOGIN_KEY = "cotter_slk"          // to save code verifier etc
  static OAUTH_SESSION_NAME = "oauth_sess" // to store data that's supposed to be on the cookies from server
  loaded: boolean;
  cotterIframeID: string;
  containerID: string;
  cancelDivID: string;
  modalID: string;
  Modal: ModalMaker;

  verifyError?: any;
  verifySuccess?: any;

  config: Config;

  static getAuthorizeURL(
    provider: string,
    apiKeyId: string,
    state: string,
    redirectURL: string,
    codeChallenge: string
  ) {
    provider = encodeURIComponent(provider);
    apiKeyId = encodeURIComponent(apiKeyId);
    state = encodeURIComponent(state);
    redirectURL = encodeURIComponent(redirectURL);
    codeChallenge = encodeURIComponent(codeChallenge);
    const loginState = {
      client_code_challenge: codeChallenge,
      client_redirect_url: redirectURL,
      client_state: state,
      action: SOCIAL_LOGIN_ACTION.LOGIN,
      company_id: apiKeyId,
    }
    const loginStateSess = btoa(JSON.stringify(loginState))
    try {
      sessionStorage.setItem(SocialLogin.OAUTH_SESSION_NAME, loginStateSess)
    } catch (e) { }

    return `${CotterEnum.BackendURL}/oauth/credential/login/${provider}?api_key_id=${apiKeyId}&state=${state}&redirect_url=${redirectURL}&code_challenge=${codeChallenge}`;
  }

  static getConnectURL(
    provider: SocialLoginProviders,
    apiKeyId: string,
    accessToken: string,
    redirectURL: string
  ) {
    apiKeyId = encodeURIComponent(apiKeyId);
    accessToken = encodeURIComponent(accessToken);
    redirectURL = encodeURIComponent(redirectURL);
    return `${CotterEnum.BackendURL}/oauth/credential/connect/${provider}?api_key_id=${apiKeyId}&access_token=${accessToken}&redirect_url=${redirectURL}`;
  }

  constructor(config: Config) {
    this.config = config;

    if (!this.config.SocialConnectText) {
      this.config.SocialConnectText = defaultSocialConnectText;
    }

    this.loaded = false;

    // Setup div and iframe ids
    this.cotterIframeID =
      Math.random().toString(36).substring(2, 15) +
      "cotter-socialConnect-iframe";
    this.containerID =
      Math.random().toString(36).substring(2, 15) +
      "cotter-socialConnect-container";
    this.cancelDivID = "modal-socialConnect-close-form";
    this.modalID = "modal-socialConnect";
    this.init();
  }
  init() {
    const url = new URL(window.location.href);
    const iframeURL = new URL(`${CotterEnum.JSURL}/social_connect`);
    iframeURL.search = url.search;
    iframeURL.searchParams.append("api_key", this.config.ApiKeyID);
    iframeURL.searchParams.append("domain", this.config.Domain);
    iframeURL.searchParams.append("redirect_url", this.config.RedirectURL);
    iframeURL.searchParams.append("id", this.containerID);

    this.Modal = new ModalMaker(
      this.modalID,
      this.containerID,
      this.cotterIframeID,
      this.cancelDivID,
      iframeURL.toString()
    );
    const modalDiv = `
    <div class="modal__overlay" tabindex="-1" id="${this.cancelDivID}" >
      <div id="modal-container" class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-socialConnect-title">
        <div id="modal-content-content" class="modal-content-content modal__container-socialConnect">
          <div id="modal-content" class="modal__content modal__content-socialConnect" >
            <div id="${this.containerID}" class="modal-frame-socialConnect"></div>
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
    var onCloseDiv = this.cancel.bind(this);
    this.Modal.initModal(onCloseDiv, modalDiv);

    this.initEventHandler();
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
      switch (data.callbackName) {
        case cID + "FIRST_LOAD":
          var postData = {
            action: "CONFIG",
            payload: {
              socialConnectText: this.config.SocialConnectText,
            },
          };
          SocialLogin.sendPost(postData, this.cotterIframeID);
          break;
        case cID + "LOADED":
          this.loaded = true;
          break;
        case cID + "CANCEL":
          this.cancel();
          break;
        case cID + "ON_SOCIAL_LOGIN_CONNECT":
          this.loginAndConnect(data.payload);
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

  async show() {
    this.Modal.showModal();

    return verificationProccessPromise(this);
  }

  cancel() {
    history.pushState({}, null, window?.location?.href?.split("?")[0]);
    this.Modal.closeModal();
  }

  onSuccess(data: any) {
    history.pushState({}, null, window?.location?.href?.split("?")[0]);
    this.Modal.closeModal();
    window.location.href = data?.url;
  }

  onError(error: any) {
    history.pushState({}, null, window?.location?.href?.split("?")[0]);
    this.Modal.closeModal();
    this.verifyError = error;
  }

  // =====================
  //          API
  // =====================
  async loginAndConnect(payload: {
    tokenID: string;
    userID: string;
    provider: string;
  }) {
    const api = new API(this.config.ApiKeyID);
    try {
      const resp = await api.loginAndConnect(
        payload.tokenID,
        payload.userID,
        payload.provider
      );
      // redirect to url
      this.onSuccess(resp);
    } catch (err) {
      this.onError(err);
    }
  }
}
export default SocialLogin;

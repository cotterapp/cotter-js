import { AUTHENTICATION_METHOD, IDENTIFIER_TYPE } from "../binder";
import Cotter from "../Cotter";
import {
  ATTR_API_KEY_ID,
  ATTR_ENV,
  DEFAULT_FORM_SETTINGS,
  DIV_CONTAINER,
  POPUP_BUTTON_HREF,
  LOGOUT_BUTTON_HREF,
  ATTR_CONFIG
} from "../constants";
import ModalMakerNoIframe from "../components/ModalMakerNoIframe";
import CotterEnum from "../enum";
import { getModalHeight } from "../helper";
import TokenHandler from "../handler/TokenHandler";
import User from "../models/User";
import UserHandler from "../handler/UserHandler";
import CompanyHandler from "../handler/CompanyHandler";

const tokenHandler = new TokenHandler();

class Loader {
  ApiKeyID: string;
  get companyInfo() {
    return CompanyHandler.getInfo()
  }
  buttons: Array<any> = [];
  containers: Array<any> = [];

  Modals: { [formID: string]: ModalMakerNoIframe } = {};
  modalID = "cotter-modal";
  containerID = "cotter-modal-form-container";
  cancelDivID = "cotter-modal-cancel";
  config: {};

  constructor() {
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
      CotterEnum.WorkerURL = "http://localhost:8787";
    } else if (env === "STAGING") {
      CotterEnum.BackendURL = "https://staging.cotter.app/api/v0";
      CotterEnum.JSURL = "https://s.js.cotter.app";
      CotterEnum.AssetURL = "https://s.js.cotter.app";
      CotterEnum.WorkerURL = "https://staging-worker.cotter.app";
    }

    // Get cotter config
    var conf = document
      .querySelector(`[${ATTR_CONFIG}]`)
      ?.getAttribute(`${ATTR_CONFIG}`);
    if (conf) {
      try {
        this.config = JSON.parse(conf);
      } catch(e) {
        console.log(`Invalid ${ATTR_CONFIG}, has to be a JSON`)
      }
    }
  }

  async identifierCheck() {
    let siteCustomization = this.companyInfo?.customization?.siteCustomization || {};
    const loggedInUser = User.getLoggedInUser()
    const { identifier } =  loggedInUser
    const resp = await fetch(`${CotterEnum.WorkerURL}/screening/site?identifier=${encodeURIComponent(identifier)}`,{
      method: "GET",
      headers: {
        API_KEY_ID: this.ApiKeyID,
        "Content-type": "application/json",
      },
    })
    const r = await resp.json()
    if(!r.passed) {
      window.location.href = siteCustomization.accessDeniedPage || "/"
    }
  }

  async protectedPageCheck() {
    // check if this page is protected
    tokenHandler.withApiKeyID(this.ApiKeyID)

    let siteCustomization = this.companyInfo?.customization?.siteCustomization || {};

    let protectedPages = siteCustomization.protectedPages ?? [];
    protectedPages = protectedPages.filter((el) => el.path.includes(window.location.pathname) || window.location.pathname.includes(el.path))

    // protection logic
    let isProtectedPage = false;
    
    protectedPages.map((page) => {
      // if we found out that this page is a protected page, continue.
      if(isProtectedPage) return;
      
      switch(page.matcher) {
        case "start":
          let reg = new RegExp('^' + page.path, 'i')
          isProtectedPage = reg.test(window.location.pathname);
          break;
        case "equal":
          isProtectedPage = window.location.pathname === page.path;
          break;
        default:
          break;
      }
    })

    if(!isProtectedPage) {
      return;
    }

    const loggedInUser = User.getLoggedInUser()
    if(!loggedInUser) {
      window.location.href = siteCustomization.accessDeniedPage || "/"
    }

    // validate access token
    try {
      let accessToken = await tokenHandler.getAccessToken()
      let token = accessToken?.token;
      
      if(!token) {
        // TODO: redirect to page denied inside the customization
        window.location.href = siteCustomization.accessDeniedPage || "/"
      }

      await this.identifierCheck();
    } catch(e) {
      throw new Error(`Fail fetching token, err: ${e}`)
    }
  }

  preInit(): Loader {
    this.protectedPageCheck()

    return this;
  }

  async init() {
    console.log("Loader Init");
    // Get all buttons that opens the login modal
    Array.from(
      document.querySelectorAll(`[href*='${POPUP_BUTTON_HREF}']`)
    ).forEach((e) => {
      var href = e.getAttribute("href");
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
    this.initBanner();

    // Get all div containers
    Array.from(document.querySelectorAll(`[id*='${DIV_CONTAINER}']`)).forEach(
      (e) => {
        var id = e.getAttribute("id");
        var formID = id?.split(DIV_CONTAINER).pop() || null;
        if (formID) {
          const containerID = DIV_CONTAINER + formID;
          this.initCotter(formID, containerID);
          this.containers.push(e);
        }
      }
    );

    // Initialize logout buttons
    Array.from(document.querySelectorAll(`[href*='${LOGOUT_BUTTON_HREF}']`)).map(
      (e) => {
        var href = e.getAttribute("href");
        var formID = href?.split(LOGOUT_BUTTON_HREF).pop() || null;

        const addLogoutHandler = () => {
          if (formID) {
            const baseRedirectURL = new URL(window.location.href).origin
            const redirectURLPath = this.companyInfo.customization?.[formID]?.afterLogoutURL
            const redirectURL = `${baseRedirectURL}${redirectURLPath}`
            
            if(!redirectURLPath) return
  
            e.addEventListener("click", () => {  
              tokenHandler.removeTokens().then(() => {
                UserHandler.remove()
                window.location.href = redirectURL
              })
            })
          }
        }
        
        if(this.companyInfo) addLogoutHandler()
        else CompanyHandler.infoPromise.finally(addLogoutHandler)
      }
    )
  }

  async initModal(formID: string) {
    if(CompanyHandler.infoPromise) await CompanyHandler.infoPromise

    // skip initializing if the modal already exists
    if(this.Modals[formID]) return

    const modalID = `${this.modalID}-${formID}`;
    const containerID = `${this.containerID}-${formID}`;
    const cancelDivID = `${this.cancelDivID}-${formID}`;
    const customization = this.companyInfo?.customization?.[formID]?? DEFAULT_FORM_SETTINGS;
    const logo = customization.logo || DEFAULT_FORM_SETTINGS.logo;
    const title = customization.modalTitle || DEFAULT_FORM_SETTINGS.modalTitle;
    const backgroundColor =
      customization.modalBackgroundColor ||
      DEFAULT_FORM_SETTINGS.modalBackgroundColor;
    const titleColor =
      customization.modalTitleColor || DEFAULT_FORM_SETTINGS.modalTitleColor;

    let modalHeight = getModalHeight(customization);
    // Init Modal
    const modal = new ModalMakerNoIframe(modalID, containerID, cancelDivID);
    const modalDiv = `
    <div class="modal__overlay" tabindex="-1" id="${cancelDivID}" >
      <div id="modal-container" class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-cotterWebAuthn-title">
        <div id="modal-content-content" class="modal-content-content modal__container-webAuthn" style="background-color: ${backgroundColor}">
          <div id="modal-content" class="modal__content modal__content-loader" >
            <img src="${logo}" class="modal-cotter-logo" style="width: 50px; height: 50px;"/>
            <div class="modal-title-loader" style="color: ${titleColor}">${title}</div>
            <div class="modal-frame-container">
              <div id="${containerID}" class="modal-frame-loader" style="width: 300px; margin: 0px 25px; height: ${modalHeight}px"></div>
            </div>
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
    modal.initModal(() => {
      onCloseDiv(formID);
      let containerDiv = document.getElementById(containerID);
      if (containerDiv) {
        let iFrame = containerDiv.getElementsByTagName("iframe")[0];
        iFrame.remove();
      }
      this.initCotter(formID, containerID);
    }, modalDiv);
    this.Modals[formID] = modal;
    this.initCotter(formID, containerID);
  }


  async initBanner() {
    if(CompanyHandler.infoPromise) await CompanyHandler.infoPromise

    const customization = this.companyInfo?.customization?.alert_banner;
    if (!customization || !customization.show_banner) return;
    // Setup Font
    var fontStyle1 = document.createElement("link");
    fontStyle1.rel = "stylesheet";
    fontStyle1.href =
      "https://fonts.googleapis.com";
    fontStyle1.rel = "preconnect"
    var fontStyle2 = document.createElement("link");
    fontStyle2.rel = "stylesheet";
    fontStyle2.href =
      "https://fonts.gstatic.com";
    fontStyle2.rel = "preconnect"
    fontStyle2.crossOrigin = "true"
    var fontStyle3 = document.createElement("link");
    fontStyle3.rel = "stylesheet";
    fontStyle3.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap";
    fontStyle3.rel = "stylesheet"
    document.head.appendChild(fontStyle1);
    document.head.appendChild(fontStyle2);
    document.head.appendChild(fontStyle3);
    
    var bannerDiv = document.createElement("div");
    bannerDiv.id = "cotter-banner-div";

    bannerDiv.style.position = 'relative';
    bannerDiv.style.top = '0px';
    bannerDiv.style.left = '0px';
    bannerDiv.style.width = 100 + "vw";
    bannerDiv.style.padding = 15 + "px";
    bannerDiv.style.background = customization.bg_color;
    bannerDiv.style.color = customization.text_color;
    bannerDiv.style.fontFamily = 'Inter';
    bannerDiv.style.display = 'flex';
    bannerDiv.style.alignItems = 'center';
    bannerDiv.style.justifyContent = 'center';
    bannerDiv.innerHTML=`<div><b>${customization.title}</b> ${customization.subtitle}</div>`;
    document.body.prepend(bannerDiv);
  }

  cancel(formID: string) {
    this.Modals[formID]?.closeModal();
  }

  async initCotter(formID: string, containerID: string) {
    var container = document.getElementById(containerID);
    if (!container) {
      let self = this;
      setTimeout(() => self.initCotter(formID, containerID), 10);
    }
    // Container on modal is loaded!
    // Get form info based on form ID
    const customization =
      this.companyInfo?.customization &&
      this.companyInfo?.customization[formID];
    const idType = customization?.type || DEFAULT_FORM_SETTINGS.type;
    const authMethod =
      customization?.authenticationMethod ||
      DEFAULT_FORM_SETTINGS.authenticationMethod;
    let cotter = new Cotter({
      ...this.config,
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
        fetch(`${CotterEnum.WorkerURL}/completion/form?form-id=${encodeURIComponent(formID)}`,{
          method: "POST",
          headers: {
            API_KEY_ID: this.ApiKeyID,
            "Content-type": "application/json",
          },
          body: JSON.stringify(resp),
        }).then((_) => {
          if (customization?.afterLoginURL) {
            window.location.href = customization.afterLoginURL;
          }
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

const __loader = new Loader().preInit()

document.addEventListener("DOMContentLoaded", () => {
  __loader.init()
});

class CotterExport extends Cotter {
  CotterEnum: CotterEnum;
}
export = CotterExport;

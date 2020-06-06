import CotterEnum from "./enum";
import { challengeFromVerifier, generateVerifier } from "./helper";

interface Config {
  ApiKeyID: string;
  Type: string;
  ContainerID: string;
  OnSuccess: Function;
  IdentifierField: string;
  CotterBaseURL?: string;
  CountryCode?: string[];
  AdditionalFields?: Object[];
  Domain?: string;
  ButtonText?: string;
  ButtonTextColor?: string;
  ErrorColor?: string;
  ButtonBorderColor?: string;
  ButtonWAText?: string;
  ButtonBackgroundColor?: string;
  ButtonWATextSubtitle?: string;
  ButtonWABackgroundColor?: string;
  ButtonWABorderColor?: string;
  ButtonWATextColor?: string;
  ButtonWALogoColor?: string;
  PhoneChannels?: string[];
  IdentifierFieldInitialValue?: string;
  IdentifierFieldDisabled?: string;
  SkipIdentifierForm?: string;
  SkipIdentifierFormWithValue?: string;
  RedirectURL?: string;
  SkipRedirectURL?: boolean;
  CaptchaRequired?: boolean;
  Styles?: Object;
  OnError?: Function;
  OnBegin?: Function;
}
class Cotter {
  config: Config;
  state: string | null;
  loaded: boolean;
  cotterIframeID: string;
  verifier: string;
  constructor(config: Config) {
    console.log("Using origin: ", new URL(window.location.href).origin);
    this.config = config;
    if (this.config.CotterBaseURL)
      CotterEnum.CotterBaseURL = this.config.CotterBaseURL;
    if (!this.config.CountryCode || this.config.CountryCode.length <= 0) {
      this.config.CountryCode = [CotterEnum.DefaultUSCode];
    }
    if (!this.config.AdditionalFields) {
      this.config.AdditionalFields = [];
    }
    this.config.Domain = new URL(window.location.href).origin;

    this.state = localStorage.getItem("COTTER_STATE");
    if (!localStorage.getItem("COTTER_STATE")) {
      this.state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("COTTER_STATE", this.state);
    }

    // SUPPORT PKCE
    this.verifier = generateVerifier();

    this.loaded = false;
    this.cotterIframeID =
      Math.random().toString(36).substring(2, 15) + "cotter-signup-iframe";

    window.addEventListener("message", (e) => {
      try {
        var data = JSON.parse(e.data);
      } catch (e) {
        // skip in case the data is not JSON formatted
        return;
      }

      // there are some additional messages that shouldn't be handled by this
      // listener, such as messages from https://js.stripe.com/
      if (e.origin !== CotterEnum.CotterBaseURL) {
        // skip this message
        return;
      }
      let cID = this.config.ContainerID;
      switch (data.callbackName) {
        case cID + "FIRST_LOAD":
          var postData = {
            action: "CONFIG",
            payload: {
              additionalFields: this.config.AdditionalFields,
              identifierField: this.config.IdentifierField,
              buttonText: this.config.ButtonText,
              buttonBackgroundColor: this.config.ButtonBackgroundColor,
              buttonTextColor: this.config.ButtonTextColor,
              errorColor: this.config.ErrorColor,
              buttonBorderColor: this.config.ButtonBorderColor,
              buttonWAText: this.config.ButtonWAText,
              buttonWATextSubtitle: this.config.ButtonWATextSubtitle,
              buttonWABackgroundColor: this.config.ButtonWABackgroundColor,
              buttonWABorderColor: this.config.ButtonWABorderColor,
              buttonWATextColor: this.config.ButtonWATextColor,
              buttonWALogoColor: this.config.ButtonWALogoColor,
              phoneChannels: this.config.PhoneChannels,
              countryCode: this.config.CountryCode,
              identifierFieldInitialValue: this.config
                .IdentifierFieldInitialValue,
              identifierFieldDisabled: this.config.IdentifierFieldDisabled,
              skipIdentiferForm: this.config.SkipIdentifierForm,
              skipIdentiferFormWithValue: this.config
                .SkipIdentifierFormWithValue,
              skipRedirectURL:
                this.config.RedirectURL === null ||
                this.config.RedirectURL === undefined ||
                (this.config.RedirectURL &&
                  this.config.RedirectURL.length <= 0) ||
                this.config.SkipRedirectURL
                  ? true
                  : false,
              captchaRequired: this.config.CaptchaRequired ? true : false,
              styles: this.config.Styles,
            },
          };
          Cotter.sendPost(postData, this.cotterIframeID);
          break;
        case cID + "LOADED":
          this.loaded = true;
          break;
        case cID + "ON_SUCCESS":
          if (this.config.OnSuccess) {
            this.config.OnSuccess(data.payload);
          }
          break;
        case cID + "ON_SUBMIT_AUTHORIZATION_CODE":
          this.submitAuthorizationCode(data.payload);
          break;
        case cID + "ON_ERROR":
          if (this.config.OnError) {
            this.config.OnError(data.payload);
          }
          break;
        case cID + "ON_BEGIN":
          console.log(this.config.OnBegin);
          // OnBegin method should return the error message
          // if there is no error, return null
          if (!!this.config.OnBegin) {
            // if OnBegin is async
            if (
              this.config.OnBegin.constructor.name === "AsyncFunction" ||
              this.config.OnBegin.toString().includes("async")
            ) {
              this.config.OnBegin(data.payload).then((err: string | null) => {
                if (!err)
                  Cotter.ContinueSubmit(data.payload, this.cotterIframeID);
                else Cotter.StopSubmissionWithError(err, this.cotterIframeID);
              });
            } else {
              let err = this.config.OnBegin(data.payload);
              if (!err)
                Cotter.ContinueSubmit(data.payload, this.cotterIframeID);
              else Cotter.StopSubmissionWithError(err, this.cotterIframeID);
            }
          } else {
            Cotter.ContinueSubmit(data.payload, this.cotterIframeID);
          }
          break;
        default:
          console.log(
            cID + " Received Message with callbackName " + data.callbackName
          );
      }
    });
  }
  showForm() {
    var container = document.getElementById(this.config.ContainerID);

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
    challengeFromVerifier(this.verifier).then((challenge) => {
      ifrm.setAttribute(
        "src",
        encodeURI(
          `${CotterEnum.CotterBaseURL}/signup?challenge=${challenge}&type=${this.config.Type}&domain=${this.config.Domain}&api_key=${this.config.ApiKeyID}&redirect_url=${this.config.RedirectURL}&state=${this.state}&id=${this.config.ContainerID}`
        )
      );
    });
    ifrm.setAttribute("allowtransparency", "true");
  }

  removeForm() {
    var ifrm = document.getElementById(this.cotterIframeID);
    ifrm!.remove();
  }

  async submitAuthorizationCode(payload: VerifyRespondResponse) {
    // Getting code from payload
    var authorizationCode = payload.authorization_code;
    var challengeID = payload.challenge_id;
    var state = payload.state;
    var clientJson = payload.client_json;

    var skipRedirectURL =
      this.config.RedirectURL === null ||
      this.config.RedirectURL === undefined ||
      (this.config.RedirectURL && this.config.RedirectURL.length <= 0) ||
      this.config.SkipRedirectURL;

    // State was set before the first request was sent
    // This is making sure that the state returned is still the same
    if (state !== this.state) {
      if (this.config.OnError) {
        var err = "State is not the same as the original request.";
        console.log(err);
        this.config.OnError(err);
      }
    }

    // Preparing data for PCKE token request
    var data = {
      code_verifier: this.verifier,
      authorization_code: authorizationCode,
      challenge_id: parseInt(challengeID),
      redirect_url: skipRedirectURL
        ? new URL(window.location.href).origin
        : this.config.RedirectURL,
    };

    var self = this;

    // Requesting oauth token from the PKCE endpoint
    fetch(
      `${CotterEnum.CotterBackendURL}/verify/get_identity?oauth_token=true`,
      {
        method: "POST",
        headers: {
          API_KEY_ID: `${self.config.ApiKeyID}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then(function (response) {
        // If not successful, call OnError and return
        if (response.status !== 200) {
          if (self.config.OnError) {
            var err = response;
            console.log(err);
            self.config.OnError(err);
          }
          return;
        }

        // Examine the text in the response
        response.json().then(function (resp) {
          // Preparing data to return to the client
          var data = clientJson;
          data.token = resp.token;
          data[self.config.IdentifierField] = resp.identifier.identifier;
          data.oauth_token = resp.oauth_token;

          // If skipRedirectURL, send the data to the client's OnSuccess function
          if (skipRedirectURL || !self.config.RedirectURL) {
            self.config.OnSuccess(data);
            return;
          } else {
            // Otherwise, send POST request to the client's RedirectURL
            fetch(self.config.RedirectURL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            })
              // Checking client's response
              .then((redirectResp: Response) => {
                const contentType = redirectResp.headers.get("content-type");
                if (
                  contentType &&
                  contentType.indexOf("application/json") !== -1
                ) {
                  return redirectResp.json().then((redirectRespJSON) => {
                    self.config.OnSuccess(redirectRespJSON);
                  });
                } else {
                  return redirectResp.text().then((redirectRespText) => {
                    self.config.OnSuccess(redirectRespText);
                  });
                }
              })
              .catch(function (error: any) {
                if (self.config.OnError) {
                  console.log(error);
                  self.config.OnError(error);
                }
              });
          }
        });
      })
      .catch((error) => {
        if (self.config.OnError) {
          console.log(error);
          self.config.OnError(error);
        }
      });
  }

  static StopSubmissionWithError(err: string, iframeID: string) {
    var postData = {
      action: "ON_ERROR",
      errorMsg: err,
    };
    Cotter.sendPost(postData, iframeID);
  }

  static ContinueSubmit(payload: object, iframeID: string) {
    var postData = {
      action: "CONTINUE_SUBMIT",
      payload: payload,
    };
    Cotter.sendPost(postData, iframeID);
  }

  static sendPost(data: object, iframeID: string) {
    var ifrm = document.getElementById(iframeID);
    if (isIFrame(ifrm) && ifrm.contentWindow) {
      ifrm!.contentWindow.postMessage(
        JSON.stringify(data),
        CotterEnum.CotterBaseURL
      );
    }
  }
}

const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
  input !== null && input.tagName === "IFRAME";

export default Cotter;

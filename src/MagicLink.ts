import CotterVerify from "./CotterVerify";
import CotterEnum from "./enum";
import { Config } from "./binder";
import { 
  challengeFromVerifier,
  verificationProccessPromise
} from "./helper";

var checkPurple = (url: String) => url + "/assets/images/check-purple.png";
var warningImage = (url: String) => url + "/assets/images/warning.png";
var tapLinkImage = (url: String) => url + "/assets/images/tapEmail.png";

const magicLinkAuthReqText = (url:String, channel:String) => ({
  title: `Approve this login through your ${channel}`,
  subtitle: `A magic link has been sent to your ${channel} to authenticate you`,
  image: tapLinkImage(url),
  titleError: "Something went wrong",
  subtitleError: "We are unable to confirm it's you, please try again",
  imageError: warningImage(url),
  imageSuccess: checkPurple(url),
  switchOTPText: "Authenticate with OTP instead",
});

class MagicLink extends CotterVerify {
  constructor(config:Config) {
    const defaultMagicLinkConfig = {
      AuthenticationMethod: "MAGIC_LINK",
    };

    // set default magic link, then assign the new configs if any
    super(Object.assign({ ...defaultMagicLinkConfig }, config));
  }

  showForm() {
    // set the authentication request config
    this.config.AuthRequestText = magicLinkAuthReqText(
      CotterEnum.CotterAssetsBaseURL,
      this.config.IdentifierField
    );

    const containerID = this.config.ContainerID || CotterEnum.DefaultContainerID;
    var container = document.getElementById(containerID);

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
      var path = `${CotterEnum.CotterBaseURL}/login?code_challenge=${challenge}&type=${this.config.Type}&domain=${this.config.Domain}&api_key=${this.config.ApiKeyID}&redirect_url=${this.config.RedirectURL}&state=${this.state}&id=${this.cID}`;
      if (this.config.CotterUserID) {
        path = `${path}&cotter_user_id=${this.config.CotterUserID}`;
      }
      ifrm.setAttribute("src", encodeURI(path));
    });
    ifrm.setAttribute("allowtransparency", "true");

    return verificationProccessPromise(this);
  }
}

export default MagicLink;
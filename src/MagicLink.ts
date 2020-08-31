import CotterVerify from "./CotterVerify";
import CotterEnum from "./enum";
import { Config } from "./binder";
import { challengeFromVerifier, verificationProccessPromise } from "./helper";
import TokenHandler from "./handler/TokenHandler";

var checkPurple = (url: String) => url + "/assets/images/check-purple.png";
var warningImage = (url: String) => url + "/assets/images/warning.png";
var tapLinkImage = (url: String) => url + "/assets/images/tapEmail.png";

const magicLinkAuthReqText = (url: String) => ({
  title: `Approve this login from your {{type}}`,
  subtitle: `A magic link has been sent to {{identifier}}`,

  image: tapLinkImage(url),
  titleError: "Something went wrong",
  subtitleError: "We are unable to confirm it's you, please try again",
  imageError: warningImage(url),
  imageSuccess: checkPurple(url),
  switchOTPText: "Authenticate with OTP instead",
  default: true,
});

class MagicLink extends CotterVerify {
  constructor(config: Config, tokenHandler?: TokenHandler) {
    const defaultMagicLinkConfig = {
      AuthenticationMethod: "MAGIC_LINK",
    };

    // set default magic link, then assign the new configs if any
    super(Object.assign({ ...defaultMagicLinkConfig }, config), tokenHandler);
  }

  showForm() {
    // set the authentication request config
    this.config.AuthRequestText = magicLinkAuthReqText(CotterEnum.AssetURL);

    const containerID =
      this.config.ContainerID || CotterEnum.DefaultContainerID;
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
      var path = `${CotterEnum.JSURL}/login?auth_method=MAGIC_LINK&code_challenge=${challenge}&type=${this.config.Type}&domain=${this.config.Domain}&api_key=${this.config.ApiKeyID}&redirect_url=${this.config.RedirectURL}&state=${this.state}&id=${this.cID}`;
      if (this.config.CotterUserID) {
        path = `${path}&cotter_user_id=${this.config.CotterUserID}`;
      }
      ifrm.setAttribute("src", encodeURI(path));
    });
    ifrm.setAttribute("allowtransparency", "true");
    ifrm.setAttribute("sandbox", "allow-same-origin");

    return verificationProccessPromise(this);
  }
}

export default MagicLink;

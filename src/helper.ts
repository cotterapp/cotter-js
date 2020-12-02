import { Config, IDENTIFIER_TYPE, VerifySuccess } from "./binder";
import WebAuthn from "./WebAuthn";
import TokenHandler from "./handler/TokenHandler";

function dec2hex(dec: any) {
  return ("0" + dec.toString(16)).substr(-2);
}

export function generateVerifier() {
  var array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}

function sha256(plain: string) {
  // returns promise ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

export function base64urlencode(a: ArrayBuffer) {
  var str = "";
  var bytes = new Uint8Array(a);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64urldecode(input: string): ArrayBuffer {
  // Replace non-url compatible chars with base64 standard chars
  input = input.replace(/-/g, "+").replace(/_/g, "/");

  // Pad out with standard base64 required padding characters
  var pad = input.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error(
        "InvalidLengthError: Input base64url string is the wrong length to determine padding"
      );
    }
    input += new Array(5 - pad).join("=");
  }

  let dcd = atob(input);
  return Uint8Array.from(dcd, (c) => c.charCodeAt(0));
}

export async function challengeFromVerifier(v: string) {
  var hashed = await sha256(v);
  var base64encoded = base64urlencode(hashed);
  return base64encoded;
}

// verificationProccessPromise checks if verifySuccess or verifyError is set
// if either is set, resolve or reject with the payload specified
export const verificationProccessPromise = (self: {
  verifySuccess?: VerifySuccess;
  verifyError?: string;
  RegisterWebAuthn?: boolean;
  config: Config;
  Identifier?: string;
  tokenHandler?: TokenHandler;
  onSuccess: (success: VerifySuccess) => void;
  onError: (error: any) => void;
}) =>
  new Promise<VerifySuccess>((resolve, reject) => {
    // create non-blocking waiting loop
    const checkVerifyProcess = () => {
      if (self.verifySuccess) {
        if (self.RegisterWebAuthn) {
          // This would be set early in the init of CotterVerify by checking if
          // - WebAuthn is enabled and the user have NO WebAuthn credentials at all
          // - or
          // - This is a request specifically to setup a new WebAuthn
          // (always accompanied by forced email/phone verification)
          const originalResp = { ...self.verifySuccess };
          self.verifySuccess = undefined;
          let web = new WebAuthn(
            {
              ApiKeyID: self.config.ApiKeyID,
              Identifier: self.Identifier,
              IdentifierField: self.config.IdentifierField,
              OriginalResponse: originalResp,
              IdentifierType: self.config.Type,
              Type: "REGISTRATION",
            },
            self.tokenHandler
          );
          web
            .show()
            .then((resp: VerifySuccess) => {
              self.onSuccess(resp);
              self.verifySuccess = resp;
              resolve(self.verifySuccess);
            })
            .catch((err) => {
              self.onError(err);
              self.verifyError = err;
              reject(self.verifyError);
            });
        } else {
          resolve(self.verifySuccess);
        }
      } else if (self.verifyError) {
        reject(self.verifyError);
      } else {
        setTimeout(checkVerifyProcess, 0);
      }
    };

    // run the loop
    checkVerifyProcess();
  });

export const isIFrame = (
  input: HTMLElement | null
): input is HTMLIFrameElement => input !== null && input.tagName === "IFRAME";

export const lightOrDark = (color: any) => {
  var r, g, b, hsp;
  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return false; // false means this color is  "light"
  } else {
    return true; // true means this color is "dark"
  }
};

export const getModalHeight = (customization: any) => {
  let modalHeight = 200;
  if (customization.captchaRequired?.toString() === "true") modalHeight = 500;
  if (customization.socialLoginProviders?.length > 0)
    modalHeight += 100 + 40 * customization.socialLoginProviders?.length;
  if (customization.type === "PHONE" && customization.phoneChannels?.length > 1)
    modalHeight += 120;
  if (customization.additionalFields?.length > 0)
    modalHeight += 100 * customization.additionalFields?.length;
  return modalHeight;
};

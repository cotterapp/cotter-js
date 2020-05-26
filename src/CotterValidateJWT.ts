import axios from "axios";
import jwkToPem from "jwk-to-pem";
import * as jsonwebtoken from "jsonwebtoken";
import jwkToBuffer from "jwk-to-pem";

const CotterBaseURL = "https://www.cotter.app/api/v0";
const CotterJWTKID = "SPACE_JWT_PUBLIC:8028AAA3-EC2D-4BAA-BE7A-7C8359CCB9F9";
const jwksPath = "/token/jwks";
const jwtAlgo = "ES256";

interface PublicKey extends jwkToBuffer.ECPrivate {
  kid: string;
  use: string;
}

interface PublicKeys {
  keys: PublicKey[];
}

interface PublicKeyMeta {
  instance: PublicKey;
  pem: string;
}

interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta;
}

let cacheKeys: MapOfKidToPublicKey | undefined;
const getPublicKeys = async (
  cotterBaseURL: string
): Promise<MapOfKidToPublicKey> => {
  if (!cacheKeys) {
    const url = `${cotterBaseURL}${jwksPath}`;
    const publicKeys = await axios.get<PublicKeys>(url);
    cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
      const pem = jwkToPem(current);
      agg[current.kid] = { instance: current, pem };
      return agg;
    }, {} as MapOfKidToPublicKey);
    return cacheKeys;
  } else {
    return cacheKeys;
  }
};

const CotterValidateJWT = async (token: string): Promise<boolean> => {
  const jwtKeys = await getPublicKeys(CotterBaseURL);
  const pubKey = jwtKeys[CotterJWTKID];

  let errResp: any | undefined;
  jsonwebtoken.verify(token, pubKey.pem, { algorithms: [jwtAlgo] }, function (
    err: any
  ) {
    errResp = err;
  });
  if (errResp) {
    console.log(errResp);
    throw new Error("Access token is inavlid" + JSON.stringify(errResp));
  }
  return true;
};

export default CotterValidateJWT;

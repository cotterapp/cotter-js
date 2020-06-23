class CotterEnum {
  static CotterBaseURL: string = "https://js.cotter.app";
  static DEV: boolean = false;
  static STAGING: boolean = false;
  static CotterAssetsBaseURL: string = CotterEnum.DEV
    ? "http://localhost:3000"
    : CotterEnum.STAGING
    ? "https://s.js.cotter.app"
    : "https://js.cotter.app";
  static CotterBackendURL = CotterEnum.DEV
    ? "http://localhost:1234/api/v0"
    : CotterEnum.STAGING
    ? "https://s.www.cotter.app/api/v0"
    : "https://www.cotter.app/api/v0";
  static DefaultUSCode: string = "+1";

  // default container ID
  static DefaultContainerID: string = "cotter-form-container";
}

export default CotterEnum;

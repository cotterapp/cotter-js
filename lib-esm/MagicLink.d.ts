import CotterVerify from "./CotterVerify";
import { Config } from "./binder";
import TokenHandler from "./handler/TokenHandler";
declare class MagicLink extends CotterVerify {
    constructor(config: Config, tokenHandler?: TokenHandler);
    showForm(): Promise<import("./binder").VerifySuccess>;
}
export default MagicLink;

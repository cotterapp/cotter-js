var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import MicroModal from "./MicroModal";
import CotterEnum from "../enum";
var ModalMaker = /** @class */ (function () {
    function ModalMaker(modalID, containerID, cotterIframeID, cancelDivID, iframePath) {
        this.modalID = modalID;
        this.containerID = containerID;
        this.cotterIframeID = cotterIframeID;
        this.cancelDivID = cancelDivID;
        this.iframePath = iframePath;
    }
    ModalMaker.prototype.initModal = function (onCloseDiv, modalDiv) {
        // Setup Font
        var fontStyle = document.createElement("link");
        fontStyle.rel = "stylesheet";
        fontStyle.href =
            "https://fonts.googleapis.com/css?family=Lato:700&display=swap";
        document.head.appendChild(fontStyle);
        var modalStyle = document.createElement("link");
        modalStyle.rel = "stylesheet";
        modalStyle.href = CotterEnum.AssetURL + "/lib/modal.css";
        document.head.appendChild(modalStyle);
        var div = document.createElement("div");
        div.className = "modal micromodal-slide";
        div.id = this.modalID;
        var att = document.createAttribute("aria-hidden");
        att.value = "true";
        div.setAttributeNode(att);
        div.innerHTML = modalDiv;
        document.body.appendChild(div);
        // set close form for cotter modal
        var closeDiv = document.getElementById(this.cancelDivID);
        if (closeDiv) {
            closeDiv.onclick = function () {
                onCloseDiv();
            };
        }
        // Load modal
        MicroModal.init({
            awaitOpenAnimation: true,
            awaitCloseAnimation: true, // [9]
        });
    };
    ModalMaker.prototype.removeSelf = function () {
        var cotterWebAuthn = document.getElementById(this.modalID);
        if (cotterWebAuthn)
            cotterWebAuthn.remove();
    };
    ModalMaker.prototype.loadIframe = function () {
        var containerID = this.containerID;
        var container = document.getElementById(containerID);
        if (container) {
        }
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("id", this.cotterIframeID);
        ifrm.style.border = "0";
        container.appendChild(ifrm);
        ifrm.style.width = "100%";
        ifrm.style.height = "100%";
        ifrm.style.overflow = "scroll";
        ifrm.setAttribute("src", encodeURI(this.iframePath));
        ifrm.setAttribute("allowtransparency", "true");
    };
    ModalMaker.prototype.removeIframe = function () {
        var ifrm = document.getElementById(this.cotterIframeID);
        ifrm.remove();
    };
    ModalMaker.prototype.showModal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self_1;
            return __generator(this, function (_a) {
                try {
                    this.activeModal = MicroModal.show(this.modalID, {});
                }
                catch (e) {
                    if (e instanceof TypeError) {
                        self_1 = this;
                        setTimeout(function () { return self_1.showModal(); }, 0);
                    }
                    else {
                        console.error(e);
                    }
                }
                finally {
                    this.loadIframe(); // setup iframe
                }
                return [2 /*return*/];
            });
        });
    };
    ModalMaker.prototype.closeModal = function () {
        if (this.activeModal)
            this.activeModal.closeModalById(this.modalID);
        else
            MicroModal.close(this.modalID);
        this.removeIframe();
        this.removeSelf();
    };
    return ModalMaker;
}());
export default ModalMaker;
//# sourceMappingURL=ModalMaker.js.map
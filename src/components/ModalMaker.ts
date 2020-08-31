import MicroModal, { Modal } from "./MicroModal";
import CotterEnum from "../enum";

class ModalMaker {
  containerID: string; // Cotter div Container ID
  modalID: string;
  cancelDivID: string;
  cotterIframeID: string;
  iframePath: string;
  activeModal?: Modal | null;

  constructor(
    modalID: string,
    containerID: string,
    cotterIframeID: string,
    cancelDivID: string,
    iframePath: string
  ) {
    this.modalID = modalID;
    this.containerID = containerID;
    this.cotterIframeID = cotterIframeID;
    this.cancelDivID = cancelDivID;
    this.iframePath = iframePath;
  }
  initModal(onCloseDiv: Function, modalDiv: string) {
    // Setup Font
    var fontStyle = document.createElement("link");
    fontStyle.rel = "stylesheet";
    fontStyle.href =
      "https://fonts.googleapis.com/css?family=Lato:700&display=swap";
    document.head.appendChild(fontStyle);

    var modalStyle = document.createElement("link");
    modalStyle.rel = "stylesheet";
    modalStyle.href = `${CotterEnum.AssetURL}/lib/modal.css`;
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
    let closeDiv = document.getElementById(this.cancelDivID);
    if (closeDiv) {
      closeDiv.onclick = () => {
        onCloseDiv();
      };
    }

    // Load modal
    MicroModal.init({
      awaitOpenAnimation: true, // [8]
      awaitCloseAnimation: true, // [9]
    });
  }

  removeSelf() {
    let cotterWebAuthn = document.getElementById(this.modalID);
    if (cotterWebAuthn) cotterWebAuthn.remove();
  }

  loadIframe() {
    const containerID = this.containerID;
    var container = document.getElementById(containerID);
    if (container) {
    }

    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("id", this.cotterIframeID);
    ifrm.style.border = "0";
    container!.appendChild(ifrm);
    ifrm.style.width = "100%";
    ifrm.style.height = "100%";
    ifrm.style.overflow = "scroll";

    ifrm.setAttribute("src", encodeURI(this.iframePath));
    ifrm.setAttribute("allowtransparency", "true");
  }

  removeIframe() {
    var ifrm = document.getElementById(this.cotterIframeID);
    ifrm!.remove();
  }

  async showModal() {
    try {
      this.activeModal = MicroModal.show(this.modalID, {});
    } catch (e) {
      if (e instanceof TypeError) {
        let self = this;
        setTimeout(() => self.showModal(), 0);
      } else {
        console.error(e);
      }
    } finally {
      this.loadIframe(); // setup iframe
    }
  }

  closeModal() {
    if (this.activeModal) this.activeModal.closeModalById(this.modalID);
    else MicroModal.close(this.modalID);
    this.removeIframe();
    this.removeSelf();
  }
}

export default ModalMaker;

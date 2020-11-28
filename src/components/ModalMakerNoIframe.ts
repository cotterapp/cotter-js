import MicroModal, { Modal } from "./MicroModal";
import CotterEnum from "../enum";

class ModalMakerNoIframe {
  containerID: string; // Cotter div Container ID
  modalID: string;
  cancelDivID: string;
  activeModal?: Modal | null;

  constructor(
    modalID: string,
    containerID: string,
    cancelDivID: string,
  ) {
    this.modalID = modalID;
    this.containerID = containerID;
    this.cancelDivID = cancelDivID;
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
    }
  }

  closeModal() {
    if (this.activeModal) this.activeModal.closeModalById(this.modalID);
    else MicroModal.close(this.modalID);
    this.removeSelf();
  }
}

export default ModalMakerNoIframe;

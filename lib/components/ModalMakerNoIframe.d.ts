import { Modal } from "./MicroModal";
declare class ModalMakerNoIframe {
    containerID: string;
    modalID: string;
    cancelDivID: string;
    activeModal?: Modal | null;
    constructor(modalID: string, containerID: string, cancelDivID: string);
    initModal(onCloseDiv: Function, modalDiv: string): void;
    showModal(): Promise<void>;
    closeModal(): void;
}
export default ModalMakerNoIframe;

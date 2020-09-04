import { Modal } from "./MicroModal";
declare class ModalMaker {
    containerID: string;
    modalID: string;
    cancelDivID: string;
    cotterIframeID: string;
    iframePath: string;
    activeModal?: Modal | null;
    constructor(modalID: string, containerID: string, cotterIframeID: string, cancelDivID: string, iframePath: string);
    initModal(onCloseDiv: Function, modalDiv: string): void;
    removeSelf(): void;
    loadIframe(): void;
    removeIframe(): void;
    showModal(): Promise<void>;
    closeModal(): void;
}
export default ModalMaker;

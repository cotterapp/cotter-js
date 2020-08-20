export class Modal {
    constructor({ targetModal, triggers, onShow, onClose, openTrigger, closeTrigger, openClass, disableScroll, disableFocus, awaitCloseAnimation, awaitOpenAnimation, debugMode, }: {
        targetModal: any;
        triggers?: any[];
        onShow?: () => void;
        onClose?: () => void;
        openTrigger?: string;
        closeTrigger?: string;
        openClass?: string;
        disableScroll?: boolean;
        disableFocus?: boolean;
        awaitCloseAnimation?: boolean;
        awaitOpenAnimation?: boolean;
        debugMode?: boolean;
    });
    modal: HTMLElement;
    config: {
        debugMode: boolean;
        disableScroll: boolean;
        openTrigger: string;
        closeTrigger: string;
        openClass: string;
        onShow: () => void;
        onClose: () => void;
        awaitCloseAnimation: boolean;
        awaitOpenAnimation: boolean;
        disableFocus: boolean;
    };
    onClick(event: any): void;
    onKeydown(event: any): void;
    /**
     * Loops through all openTriggers and binds click event
     * @param  {array} triggers [Array of node elements]
     * @return {void}
     */
    registerTriggers(...triggers: any[]): void;
    showModal(event?: any): void;
    activeElement: Element;
    closeModal(event?: any): void;
    closeModalById(targetModal: any): void;
    scrollBehaviour(toggle: any): void;
    addEventListeners(): void;
    removeEventListeners(): void;
    getFocusableNodes(): any[];
    /**
     * Tries to set focus on a node which is not a close trigger
     * if no other nodes exist then focuses on first close trigger
     */
    setFocusToFirstNode(): void;
    retainFocus(event: any): void;
}
export default MicroModal;
declare namespace MicroModal {
    export { init };
    export { show };
    export { close };
}
/**
 * Binds click handlers to all modal triggers
 * @param  {object} config [description]
 * @return void
 */
declare function init(config: object): void;
/**
 * Shows a particular modal
 * @param  {string} targetModal [The id of the modal to display]
 * @param  {object} config [The configuration object to pass]
 * @return {Modal?}
 */
declare function show(targetModal: string, config: object): Modal | null;

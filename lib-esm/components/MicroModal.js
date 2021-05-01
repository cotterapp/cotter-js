var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var FOCUSABLE_ELEMENTS = [
    "a[href]",
    "area[href]",
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    "select:not([disabled]):not([aria-hidden])",
    "textarea:not([disabled]):not([aria-hidden])",
    "button:not([disabled]):not([aria-hidden])",
    "iframe",
    "object",
    "embed",
    "[contenteditable]",
    '[tabindex]:not([tabindex^="-"])',
];
var Modal = /** @class */ (function () {
    function Modal(_a) {
        var targetModal = _a.targetModal, _b = _a.triggers, triggers = _b === void 0 ? [] : _b, _c = _a.onShow, onShow = _c === void 0 ? function () { } : _c, _d = _a.onClose, onClose = _d === void 0 ? function () { } : _d, _e = _a.openTrigger, openTrigger = _e === void 0 ? "data-micromodal-trigger" : _e, _f = _a.closeTrigger, closeTrigger = _f === void 0 ? "data-micromodal-close" : _f, _g = _a.openClass, openClass = _g === void 0 ? "is-open" : _g, _h = _a.disableScroll, disableScroll = _h === void 0 ? false : _h, _j = _a.disableFocus, disableFocus = _j === void 0 ? false : _j, _k = _a.awaitCloseAnimation, awaitCloseAnimation = _k === void 0 ? false : _k, _l = _a.awaitOpenAnimation, awaitOpenAnimation = _l === void 0 ? false : _l, _m = _a.debugMode, debugMode = _m === void 0 ? false : _m;
        // Save a reference of the modal
        this.modal = document.getElementById(targetModal);
        // Save a reference to the passed config
        this.config = {
            debugMode: debugMode,
            disableScroll: disableScroll,
            openTrigger: openTrigger,
            closeTrigger: closeTrigger,
            openClass: openClass,
            onShow: onShow,
            onClose: onClose,
            awaitCloseAnimation: awaitCloseAnimation,
            awaitOpenAnimation: awaitOpenAnimation,
            disableFocus: disableFocus,
        };
        // Register click events only if pre binding eventListeners
        if (triggers.length > 0)
            this.registerTriggers.apply(this, triggers);
        // pre bind functions for event listeners
        this.onClick = this.onClick.bind(this);
        this.onKeydown = this.onKeydown.bind(this);
    }
    /**
     * Loops through all openTriggers and binds click event
     * @param  {array} triggers [Array of node elements]
     * @return {void}
     */
    Modal.prototype.registerTriggers = function () {
        var _this = this;
        var triggers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            triggers[_i] = arguments[_i];
        }
        triggers.filter(Boolean).forEach(function (trigger) {
            trigger.addEventListener("click", function (event) { return _this.showModal(event); });
        });
    };
    Modal.prototype.showModal = function (event) {
        var _this = this;
        if (event === void 0) { event = null; }
        this.activeElement = document.activeElement;
        this.modal.setAttribute("aria-hidden", "false");
        this.modal.classList.add(this.config.openClass);
        this.scrollBehaviour("disable");
        this.addEventListeners();
        if (this.config.awaitOpenAnimation) {
            var handler_1 = function () {
                _this.modal.removeEventListener("animationend", handler_1, false);
                _this.setFocusToFirstNode();
            };
            this.modal.addEventListener("animationend", handler_1, false);
        }
        else {
            this.setFocusToFirstNode();
        }
        this.config.onShow(this.modal, this.activeElement, event);
    };
    Modal.prototype.closeModal = function (event) {
        if (event === void 0) { event = null; }
        var modal = this.modal;
        this.modal.setAttribute("aria-hidden", "true");
        this.removeEventListeners();
        this.scrollBehaviour("enable");
        if (this.activeElement && this.activeElement.focus) {
            this.activeElement.focus();
        }
        this.config.onClose(this.modal, this.activeElement, event);
        if (this.config.awaitCloseAnimation) {
            var openClass_1 = this.config.openClass; // <- old school ftw
            this.modal.addEventListener("animationend", function handler() {
                modal.classList.remove(openClass_1);
                modal.removeEventListener("animationend", handler, false);
            }, false);
        }
        else {
            modal.classList.remove(this.config.openClass);
        }
    };
    Modal.prototype.closeModalById = function (targetModal) {
        this.modal = document.getElementById(targetModal);
        if (this.modal)
            this.closeModal();
    };
    Modal.prototype.scrollBehaviour = function (toggle) {
        if (!this.config.disableScroll)
            return;
        var body = document.querySelector("body");
        switch (toggle) {
            case "enable":
                Object.assign(body.style, { overflow: "" });
                break;
            case "disable":
                Object.assign(body.style, { overflow: "hidden" });
                break;
            default:
        }
    };
    Modal.prototype.addEventListeners = function () {
        this.modal.addEventListener("touchstart", this.onClick);
        this.modal.addEventListener("click", this.onClick);
        document.addEventListener("keydown", this.onKeydown);
    };
    Modal.prototype.removeEventListeners = function () {
        this.modal.removeEventListener("touchstart", this.onClick);
        this.modal.removeEventListener("click", this.onClick);
        document.removeEventListener("keydown", this.onKeydown);
    };
    Modal.prototype.onClick = function (event) {
        if (event.target.hasAttribute(this.config.closeTrigger)) {
            this.closeModal(event);
        }
    };
    Modal.prototype.onKeydown = function (event) {
        if (event.keyCode === 27)
            this.closeModal(event); // esc
        if (event.keyCode === 9)
            this.retainFocus(event); // tab
    };
    Modal.prototype.getFocusableNodes = function () {
        var nodes = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS);
        return Array.apply(void 0, nodes);
    };
    /**
     * Tries to set focus on a node which is not a close trigger
     * if no other nodes exist then focuses on first close trigger
     */
    Modal.prototype.setFocusToFirstNode = function () {
        var _this = this;
        if (this.config.disableFocus)
            return;
        var focusableNodes = this.getFocusableNodes();
        // no focusable nodes
        if (focusableNodes.length === 0)
            return;
        // remove nodes on whose click, the modal closes
        // could not think of a better name :(
        var nodesWhichAreNotCloseTargets = focusableNodes.filter(function (node) {
            return !node.hasAttribute(_this.config.closeTrigger);
        });
        if (nodesWhichAreNotCloseTargets.length > 0)
            nodesWhichAreNotCloseTargets[0].focus();
        if (nodesWhichAreNotCloseTargets.length === 0)
            focusableNodes[0].focus();
    };
    Modal.prototype.retainFocus = function (event) {
        var focusableNodes = this.getFocusableNodes();
        // no focusable nodes
        if (focusableNodes.length === 0)
            return;
        /**
         * Filters nodes which are hidden to prevent
         * focus leak outside modal
         */
        focusableNodes = focusableNodes.filter(function (node) {
            return node.offsetParent !== null;
        });
        // if disableFocus is true
        if (!this.modal.contains(document.activeElement)) {
            focusableNodes[0].focus();
        }
        else {
            var focusedItemIndex = focusableNodes.indexOf(document.activeElement);
            if (event.shiftKey && focusedItemIndex === 0) {
                focusableNodes[focusableNodes.length - 1].focus();
                event.preventDefault();
            }
            if (!event.shiftKey &&
                focusableNodes.length > 0 &&
                focusedItemIndex === focusableNodes.length - 1) {
                focusableNodes[0].focus();
                event.preventDefault();
            }
        }
    };
    return Modal;
}());
export { Modal };
var MicroModal = (function () {
    "use strict";
    /**
     * Modal prototype ends.
     * Here on code is responsible for detecting and
     * auto binding event handlers on modal triggers
     */
    // Keep a reference to the opened modal
    var activeModal = null;
    /**
     * Generates an associative array of modals and it's
     * respective triggers
     * @param  {array} triggers     An array of all triggers
     * @param  {string} triggerAttr The data-attribute which triggers the module
     * @return {array}
     */
    var generateTriggerMap = function (triggers, triggerAttr) {
        var triggerMap = [];
        triggers.forEach(function (trigger) {
            var targetModal = trigger.attributes[triggerAttr].value;
            if (triggerMap[targetModal] === undefined)
                triggerMap[targetModal] = [];
            triggerMap[targetModal].push(trigger);
        });
        return triggerMap;
    };
    /**
     * Validates whether a modal of the given id exists
     * in the DOM
     * @param  {number} id  The id of the modal
     * @return {boolean}
     */
    var validateModalPresence = function (id) {
        if (!document.getElementById(id)) {
            console.warn("MicroModal: \u2757Seems like you have missed %c'" + id + "'", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "ID somewhere in your code. Refer example below to resolve it.");
            console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "<div class=\"modal\" id=\"" + id + "\"></div>");
            return false;
        }
    };
    /**
     * Validates if there are modal triggers present
     * in the DOM
     * @param  {array} triggers An array of data-triggers
     * @return {boolean}
     */
    var validateTriggerPresence = function (triggers) {
        if (triggers.length <= 0) {
            console.warn("MicroModal: \u2757Please specify at least one %c'micromodal-trigger'", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "data attribute.");
            console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "<a href=\"#\" data-micromodal-trigger=\"my-modal\"></a>");
            return false;
        }
    };
    /**
     * Checks if triggers and their corresponding modals
     * are present in the DOM
     * @param  {array} triggers   Array of DOM nodes which have data-triggers
     * @param  {array} triggerMap Associative array of modals and their triggers
     * @return {boolean}
     */
    var validateArgs = function (triggers, triggerMap) {
        validateTriggerPresence(triggers);
        if (!triggerMap)
            return true;
        for (var id in triggerMap)
            validateModalPresence(id);
        return true;
    };
    /**
     * Binds click handlers to all modal triggers
     * @param  {object} config [description]
     * @return void
     */
    var init = function (config) {
        // Create an config object with default openTrigger
        var options = Object.assign({}, { openTrigger: "data-micromodal-trigger" }, config);
        // Collects all the nodes with the trigger
        var triggers = __spreadArray([], document.querySelectorAll("[" + options.openTrigger + "]"));
        // Makes a mappings of modals with their trigger nodes
        var triggerMap = generateTriggerMap(triggers, options.openTrigger);
        // Checks if modals and triggers exist in dom
        if (options.debugMode === true &&
            validateArgs(triggers, triggerMap) === false)
            return;
        // For every target modal creates a new instance
        for (var key in triggerMap) {
            var value = triggerMap[key];
            options.targetModal = key;
            options.triggers = __spreadArray([], value);
            activeModal = new Modal(options); // eslint-disable-line no-new
        }
    };
    /**
     * Shows a particular modal
     * @param  {string} targetModal [The id of the modal to display]
     * @param  {object} config [The configuration object to pass]
     * @return {Modal?}
     */
    var show = function (targetModal, config) {
        var options = config || {};
        options.targetModal = targetModal;
        // Checks if modals and triggers exist in dom
        if (options.debugMode === true &&
            validateModalPresence(targetModal) === false)
            return null;
        // clear events in case previous modal wasn't close
        if (activeModal)
            activeModal.removeEventListeners();
        // stores reference to active modal
        activeModal = new Modal(options); // eslint-disable-line no-new
        activeModal.showModal();
        return activeModal;
    };
    /**
     * Closes the active modal
     * @param  {string} targetModal [The id of the modal to close]
     * @return {void}
     */
    var close = function (targetModal) {
        targetModal
            ? activeModal.closeModalById(targetModal)
            : activeModal.closeModal();
    };
    return { init: init, show: show, close: close };
})();
export default MicroModal;
//# sourceMappingURL=MicroModal.js.map
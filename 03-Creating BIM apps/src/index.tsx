import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import * as BUI from "@thatopen/ui";

BUI.Manager.init();

const BimLabel = customElements.get("bim-label");
if (BimLabel && !customElements.get("beam-label")) {
    class BeamLabel extends (BimLabel as typeof HTMLElement) {}
    customElements.define("beam-label", BeamLabel);
}

const BimTextInput = customElements.get("bim-text-input");
if (BimTextInput && !customElements.get("beam-text-input")) {
    class BeamTextInput extends (BimTextInput as typeof HTMLElement) {}
    customElements.define("beam-text-input", BeamTextInput);
}

const BimButton = customElements.get("bim-button");
if (BimButton && !customElements.get("beam-button")) {
    class BeamButton extends (BimButton as typeof HTMLElement) {}
    customElements.define("beam-button", BeamButton);
}


const rootElement = document.getElementById("app");
if (!rootElement) {
    throw new Error("Root element not found.");
}

const appRoot = ReactDOM.createRoot(rootElement);
appRoot.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

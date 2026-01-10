import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import * as BUI from "@thatopen/ui";

BUI.Manager.init();


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

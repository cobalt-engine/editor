import "react-contexify/ReactContexify.css";
import "./index.scss";

import {
  DndProvider,
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <App />
    </DndProvider>
  </React.StrictMode>
);

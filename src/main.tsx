import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Core from "./components/layout/core";
import router from "./routes";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Core>
      <RouterProvider router={router} />
    </Core>
  </StrictMode>
);

import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth";
import { appRoutes } from "./app";

export const router = createBrowserRouter([
  authRoutes,
  appRoutes,
]);

export default router;

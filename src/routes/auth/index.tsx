import * as guard from "@/components/guards";
import * as layout from "@/components/layout";
import * as pages from "@/modules";
import { ROUTES } from "@/routes/routes";
import { Navigate } from "react-router-dom";

export const authRoutes = {
  path: "/",
  element: <guard.Guest />,
  children: [
    {
      element: <layout.Auth />,
      children: [
        {
          path: "/",
          element: <Navigate to={ROUTES.Auth.Login} replace />,
        },
        {
          path: ROUTES.Auth.Login,
          element: <pages.LoginPage />,
        },
        {
          path: ROUTES.Auth.OAuthCallback,
          element: <pages.OAuthCallbackPage />,
        },
      ],
    },
  ],
};

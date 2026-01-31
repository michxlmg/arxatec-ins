import { createBrowserRouter, Navigate } from "react-router-dom";
import * as guard from "@/components/guards";
import * as layout from "@/components/layout";
import * as pages from "@/modules";
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
  {
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
        ],
      },
    ],
  },
  {
    path: "/",
    element: <guard.Auth />,
    children: [
      {
        path: ROUTES.App.Workspaces,
        element: <pages.WorkspaceSelector />,
      },
      {
        element: <layout.Assistant />,
        children: [
            {
                path: ROUTES.App.Chat,
                element: <pages.ChatPage />,
            },
            {
                path: "/chat",
                element: <Navigate to={ROUTES.App.Workspaces} replace />,
            }
        ]
      }
    ],
  },
]);

export default router;

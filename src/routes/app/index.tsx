import * as guard from "@/components/guards";
import * as layout from "@/components/layout";
import * as pages from "@/modules";
import { ROUTES } from "@/routes/routes";
import { Navigate } from "react-router-dom";

export const appRoutes = {
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
        },
      ],
    },
  ],
};

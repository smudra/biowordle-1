import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { Game, loader as gameLoader } from "./Game";
import { Admin } from "./Admin";
import { ErrorBoundary } from "./ErrorBoundary";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Game />,
    errorElement: <ErrorBoundary />,
    loader: gameLoader,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

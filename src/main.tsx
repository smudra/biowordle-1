import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { App } from "./App";
import { Auth } from "./Auth";
import { Game, loader as gameLoader } from "./Game";
import { Admin } from "./Admin";
import { Profile, action as profileAction } from "./Profile";
import { Leaderboard } from "./Leaderboard";
import { ErrorBoundary } from "./ErrorBoundary";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorBoundary />}>
      <Route element={<Game />} index loader={gameLoader} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/profile" element={<Profile />} action={profileAction} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/__auth/*" element={<Auth />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

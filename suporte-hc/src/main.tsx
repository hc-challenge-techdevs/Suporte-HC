import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./routes/Error/index.tsx";
import PaginaInicial from "./routes/PaginaInicial/index.tsx";
import Lembretes from "./routes/Lembretes/index.tsx";
import Tutorial from "./routes/Tutorial/index.tsx";
import DetalheTutorial from "./components/DetalheTutorial/DetalheTutorial.tsx";
import Contato from "./routes/Contato/index.tsx";
import FAQ from "./routes/FAQ/index.tsx";
import Cadastro from "./routes/Cadastro/index.tsx";
import Login from "./routes/Login/index.tsx";
import Usuario from "./routes/Usuario/index.tsx";
import { ThemeProvider } from "./components/ThemeContext/ThemeContext.tsx";
import Integrantes from "./routes/Integrantes/index.tsx";

import "./globals.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <PaginaInicial /> },
      { path: "/integrantes", element: <Integrantes /> },
      { path: "/contato", element: <Contato /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/tutorial", element: <Tutorial /> },
      { path: "/tutorial/:titulo", element: <DetalheTutorial /> },
      { path: "/lembretes", element: <Lembretes /> },
      { path: "/login", element: <Login /> },
      { path: "/cadastro", element: <Cadastro /> },
      { path: "/usuario", element: <Usuario /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading</div>}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>
);
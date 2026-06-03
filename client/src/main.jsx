// •  React
import React, { Component, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom';

// •  Layouts
import UserLayout from './layouts/userlayout';
import DashboardLayout from './layouts/dashboardLayout';

// •  Modules
import App from './App';
import Intro from './modules/intro';
import LoadingPage from './modules/loadingpage';
import OnBoarding from './modules/onboarding';

import Spamalaxy from './modules/spamalaxy/spamalaxy';
import UsersSystem from './modules/spamalaxy/usersystem';
import UserCellInfos from './modules/spamalaxy/cells';

// • Loaders
import Loader from './loaders/loader';
import Loader2 from './loaders/loader2';

// • Errors
import ErrorPage from './error'

// • TailwindCSS
import './tailwind-setup.css';


// • Routing
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    errorElement: <ErrorPage />
  },
  {
    path: "/intro",
    loader: () => Loader(4000),
   // HydrateFallback: () => LoadingPage("Embarquement dans le [à définir]", "bg1"),
    lazy: () => import('./modules/intro').then(module => ({
      Component: module.default
    })),
    errorElement: <ErrorPage />
  },
  {
    path: "/onboarding",
    loader: () => {
      // On renvoie un objet classique avec la promesse à l'intérieur
      return {
        donneesLentes: Loader2(10000)
      };
    },
    Component: OnBoarding,
    /* 
     HydrateFallback: () => LoadingPage("Chargement du didactitiel","bg2"),
     lazy: () => import('./modules/onboarding').then(module => ({
       Component: module.default
     })),
     */
    errorElement: <ErrorPage />
  },
  {
    path: "/dashboard",
    loader: () => Loader(4000),
   // HydrateFallback: () => LoadingPage("Bienvenue dans la spamalaxie", "bg3"),
    lazy: () => import('./layouts/dashboardLayout').then(module => ({
      Component: module.default,
    })),
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Spamalaxy },
      {
        path: "users/:userId", Component: UserLayout, children: [
          { index: true, Component: UsersSystem },
          { path: "cells/:cellId", Component: UserCellInfos }
        ]
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
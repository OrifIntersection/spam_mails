// •  React
import React, { Component, StrictMode, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useRouteError, NavLink, Outlet, useLoaderData, useNavigation } from 'react-router-dom';

// • TailwindCSS
import './tailwind-setup.css';

/*
// •  Layouts
import UserLayout from './layouts/userlayout';
import DashboardLayout from './layouts/dashboardLayout';

// •  Modules
import App from './App';
import Intro from './modules/intro';
*/
import LoadingPage from './modules/loadingpage';
/*
import OnBoarding from './modules/onboarding';

import Spamalaxy from './modules/spamalaxy/spamalaxy';
import UsersSystem from './modules/spamalaxy/usersystem';
import UserCellInfos from './modules/spamalaxy/cells';

// • Loaders
import Loader from './loaders/loader';
import Loader2 from './loaders/loader2';

// • Errors
import ErrorPage from './error'




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
    /
    // HydrateFallback: () => LoadingPage("Chargement du didactitiel","bg2"),
    // lazy: () => import('./modules/onboarding').then(module => ({
    //   Component: module.default
    //  })),
     
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
]);*/

// Une petite fonction utilitaire pour simuler un délai dans les loaders
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/*
function DefaultLayout({ timer }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  // Vérifie si une navigation est en cours (un loader est en train de tourner)
  let isLoading = navigation.state === "loading";

  useEffect(() => {
    if (isLoading != "loading") {
      setLoading(false)
      console.log("OK")
    }
  }, [navigation.state])


  loading ? console.log("Yes") : console.log("NO");

  return (
    <div className="app-container">
      {/* Si le routeur charge des données, on affiche le composant de chargement /}
      {isLoading && <div className="global-spinner"><LoadingPage /></div>}

      <main className={isLoading ? "hidden" : ""}>
        {/* L'Outlet affiche la route active }
        <Outlet />
      </main>
    </div>
  );
}
*/
function RootLayout() {
  return <div>
    <header>
      <div>LOGO</div>
      <ul>
        <li><NavLink to="/" className={({ isActive, isPending, isTransitioning }) =>
          [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
        }>Home</NavLink></li>

        <li><NavLink to="/auth/login" className={({ isActive, isPending, isTransitioning }) =>
          [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
        }>Login</NavLink></li>
      </ul>
    </header>
    <hr />
    <Outlet />

  </div>;
}

function Home() {
  return <>
    <h1>Home</h1>
    <NavLink to="/explore" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Explore Galaxy</NavLink>


    <NavLink to="/onboarding" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Onboarding</NavLink>
  </>;
}


function Onboarding() {
  return <> <h1>Onboarding</h1>
    <NavLink to="/explore" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Explore Galaxy</NavLink>


    <NavLink to="/" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Back to home</NavLink>
  </>
}

function AuthLayout() {
  return <div><Outlet /></div>;
}

function Login() {
  return <>
    <h1>Login form</h1>
    <NavLink to="/auth/register" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Register</NavLink>
  </>;
}

function Register() {
  return <>
    <h1>Register form</h1>
    <NavLink to="/auth/login" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Login</NavLink>
  </>;
}

function ExploreLayout() {

  return <>
    <NavLink to="/explore" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Spamalaxie</NavLink>

    <NavLink to="/explore/systems/me" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>My system</NavLink>

    <form action="/explore/search">
      <input type="text" name="user" placeholder="Search a user" />
      <input type="submit" value="Search" />
    </form>

    <NavLink to="/" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Back to home</NavLink>
    <div><Outlet /></div>

  </>;
}

function ExploreGalaxy() {
  const { galaxy } = useLoaderData();
  console.log(galaxy)
  //----------------------------------------------------
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  let isLoading = navigation.state === "loading";
  
  loading ? console.log("Yes") : console.log("NO");

  useEffect(() => { 
    if (isLoading != "loading") {
      setLoading(false);
      console.log("OK")
    }
  }, [navigation.state])

  return <>
  {isLoading && <LoadingPage/>}
  <h1>Explore galaxy</h1>
    <NavLink to="/explore/systems/random-user" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Find a user system</NavLink>
  </>;
}

function ExploreUserSystem() {
  const { system } = useLoaderData();

  return <><h1>Explore user system</h1>
    <NavLink to="/explore/systems/random-user/blobs/blob-id" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Find a blob</NavLink>
    <NavLink to="/explore" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Back to galaxy</NavLink>
  </>;
}

function ExploreUserSytemBlob() {
  const { blob } = useLoaderData();

  return <>
    <h1>Explore user system blob</h1>
    <NavLink to="/explore/systems/random-user" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Back to user system</NavLink>
  </>;
}

function ExploreSearch() {
  const { users } = useLoaderData();

  return <><h1>Explore search</h1>

    <NavLink to="/explore/systems/searched-user" className={({ isActive, isPending, isTransitioning }) =>
      [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
    }>Find a user system</NavLink></>;
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "onboarding", Component: Onboarding },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
      {
        path: "explore",
        element: ExploreLayout,
        children: [
          {
            index: true,
            loader: async () => {
              await new Promise(resolve => setTimeout(resolve,2000))
              return { galaxy: [] };
            },
            Component: ExploreGalaxy
          },
          {
            path: "search",
            loader: async () => {
              return { users: [] };
            },
            Component: ExploreSearch
          },
          {
            path: "systems/:userId",
            children: [
              {
                index: true,
                loader: async () => {
                  return { system: {} };
                },
                Component: ExploreUserSystem
              },
              {
                path: "blobs/:blobId",
                loader: async () => {
                  return { blob: { id: "blod-id" } };
                },
                Component: ExploreUserSytemBlob
              },
            ],
          }
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
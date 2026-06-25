// •  React
import React, { Component, StrictMode, Suspense, useEffect, useState, createContext, useRef, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useRouteError, NavLink, Outlet, useLoaderData, useNavigation, useLocation } from 'react-router-dom';
import chalk from 'chalk';

// • TailwindCSS
import './tailwind-setup.css';
import LoadingPage from './modules/loadingpage';

// • Assets
import Chips from './assets/UI/chips';
import Button from './assets/UI/button';
// • Path
const explore = "explore";
const search = "search";
const home = "/";
const auth = "auth";
const systemsUserId = "systems/:userId";
const blobsBlobId = "blobs/:blobId";


//  Setup RequestAnimationFrame()
let output = document.getElementById("output");
let totalFrames = 0;
let current, consumedTime;

// Set fps to 30
let fps = 30;
let intervalOffps = 1000 / fps;
let lastFrameTime = Date.now();
let startTime = lastFrameTime;

//// ─────────────────────────
//      OTHER
const canvasWidth = 2000;
const canvasHeight = 100;

//  To catch the current location
let currentLocation = null;

//  Arc && arc animation
let rayon = 40;
let speed = 5;

// • UpLeft
const defaultPositionxUpLeft = rayon;
const defaultPositionyUpLeft = rayon;

// • UpRight
const defaultPositionxUpRight = canvasWidth - rayon;
const defaultPositionyUpRight = rayon;

// • DownLeft
const defaultPositionxDownLeft = rayon;
const defaultPositionyDownLeft = canvasHeight - rayon;

// • DownRight
const defaultPositionxDownRight = canvasWidth - rayon;
const defaultPositionyDownRight = canvasHeight - rayon;

//  Une petite fonction utilitaire pour simuler un délai dans les loaders
//const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


//  Layout principal
function RootLayout() {
  const [animation, setAnimation] = useState("exploreusersystem");
  const [position, setPosition] = useState(null)
  const [good, setGood] = useState(false);
  const x = useRef(40);
  const y = useRef(40);
  const canvasRef = useRef(null);
  const direction = useRef("left");
  const direction2 = useRef("down");
  const location = useLocation();

  useEffect(() => {
    currentLocation = location;
    console.log("%cL'utilisateur est sur la page :" + location.pathname, "color: #0070f3; font-weight: bold;");
    console.log("%cParamètres de recherche (URL) :" + location.search, "color: #0070f3; font-weight: bold;");
  }, [location])

  //  Regex
  const regexUserSystem = `^\/?${explore}\/systems\/[^/]+$`
  const regexBlobId = `^\/${explore}\/systems.*\/blobs\/.*`;
  const regexBlob = new RegExp(regexBlobId);
  const regexUser = new RegExp(regexUserSystem);

  useEffect(() => {
    let animationId;
    let current = 0;
    let consumedTime = 0;
    let lastFrameTime = 0;
    const intervalOffps = 16;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    if (parent) {
      ctx.canvas.width = parent.clientWidth - (parent.clientWidth / 100 * 30);
      ctx.canvas.height = parent.clientHeight;
    } else {
      console.log("Pas de parents")
    }

    window.addEventListener("resize", (event) => {


    })

    function switchFunction(selectedCase) {
      console.log(selectedCase)
      if (x.current > defaultPositionxUpLeft) {
        x.current -= speed;
      } if (x.current < defaultPositionxUpLeft) {
        x.current += speed;
      } if (y.current < defaultPositionyUpLeft) {
        y.current += speed;
      } if (y.current > defaultPositionyUpLeft) {
        y.current -= speed;
      }
    }

    function draw() {
      if (!canvas) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      switch (position) {
        case 'UpLeft':
          switchFunction(UpLeft);
          break;

        case 'UpRight':
          switchFunction(UpRight);
          break;

        case 'DownLeft':
          switchFunction(DownLeft);
          break;

        case 'DownRight':
          switchFunction(DownRight)
          break;

        case null:
          console.log("NULL");
          break;
      }

      current = Date.now();
      consumedTime = current - lastFrameTime;

      if (consumedTime > intervalOffps) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(x.current, y.current, rayon, 0, 2 * Math.PI);
        ctx.stroke();

        lastFrameTime = current - (consumedTime % intervalOffps);
      }

      animationId = requestAnimationFrame(draw);
    }

    animationId = requestAnimationFrame(draw);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [position]);

  function handleClickUpLeft() {
    setPosition("UpLeft");
  };

  function handleClickUpRight() {
    setPosition("UpRight");
  };

  function handleClickDownLeft() {
    setPosition("DownLeft");
  };

  function handleClickDownRight() {
    setPosition("DownRight");
  };
  {/*
    <button onClick={handleClickUpLeft} className='hover:opacity-[50%]'>upleft</button>
    <button onClick={handleClickUpRight} className='hover:opacity-[50%]'>upright</button><br />

    <button onClick={handleClickDownLeft} className='hover:opacity-[50%]'>downleft</button>
    <button onClick={handleClickDownRight} className='hover:opacity-[50%]'>downright</button>
    
    
    <hr />
    <Outlet />
    */}
  return <>
    <header className='flex flex-row items-center justify-center w-[100%] h-[10%]'>
      <div>LOGO</div>
      <ul className='flex flex-row items-center justify-center'>
        <li><NavLink to="/" className={({ isActive, isPending, isTransitioning }) =>
          [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
        }>Home</NavLink></li>

        <li><NavLink to="/auth/login" className={({ isActive, isPending, isTransitioning }) =>
          [isActive ? "text-pink-500" : "text-blue-500"].join(" ")
        }>Login</NavLink></li>
      </ul>
    </header>
    <section className='flex flex-col flex-wrap justify-center align-center w-[100%] h-[90%]'>
      <div className={`w-[100%] h-[100%] bg-green-100`}>
        <canvas className="bg-red-100" id="tutoriel" ref={canvasRef}>
          <h1>Le canvas n'est pas supporté...</h1>
        </canvas>
      </div>
      {/*<div className='w-[30%] h-[100%]'>
        </div>      
        <Outlet/>
      */}
    </section>
  </>;
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

  return (<>
    {/* <NavLink to="/explore" className={({ isActive, isPending, isTransitioning }) =>
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
*/}
    <div className='flex flex-row items-center justify-center '>

    </div>
    <section>
      <Outlet />
      <div className='w-[25%] h-[100%]'></div>
    </section>
    <div>
    </div >
  </>);
}

function ExploreGalaxy() {
  const { galaxy } = useLoaderData();
  //----------------------------------------------------
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  let isLoading = navigation.state === "loading";
  useEffect(() => {
    if (isLoading != "loading") {
      setLoading(false);
    }
  }, [navigation.state])

  return <>
    {isLoading && <LoadingPage />}
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

function AdvancedSearch() {
  return (<div className='flex items-center justify-center flex-col flex-nowrap h-[100%]'>
    <div className='flex items-center justify-center w-[100%] h-[25%]'>
      <Button color={"#34e5eb"} textcolor={"#FFFFFF"} label={"Voir mon système utilisateur"} width={"300px"} height={"150px"} />
    </div>
    <div className='flex items-center justify-center w-[100%] h-[50%]'>
      <div className='flex items-stretch justify-center flex-col flex-nowrap w-[600px] h-[50%] gap-[20px]'>
        <div className='flex items-center justify-around flex-row w-[100%]'>
          <Chips color={"#ff4757"} label={"Peur"} />
          <Chips color={"#1d9f33"} label={"Culpabilité"} />
          <Chips color={"#e9dd3e"} label={"Humiliation"} />
        </div>
        <div className='flex items-center justify-around flex-row w-[100%]'>
          <Chips color={"#35c2d7"} label={"Déception"} />
          <Chips color={"#3c2d9f"} label={"Agacement"} />
          <Chips color={"#7f2129"} label={"Indignation"} />
        </div>
      </div>
    </div>
    <div className='flex items-center justify-center w-[100%] h-[25%]'>
      <h3> Recherche avancée</h3>
    </div>
  </div>)
}

function Exploration() {
  return (<>
  </>)
}

const router = createBrowserRouter([
  {
    path: home,
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
        path: explore,
        Component: ExploreLayout,
        children: [
          {
            index: true,
            loader: async () => {
              await new Promise(resolve => setTimeout(resolve, 2000)); // ⏱️ Attend 2 secondes             
              return { galaxy: [] };
            },
            Component: ExploreGalaxy
          },
          {
            path: search,
            loader: async () => {
              return { users: [] };
            },
            Component: ExploreSearch
          },
          {
            path: systemsUserId,
            children: [
              {
                index: true,
                loader: async () => {
                  return { system: {} };
                },
                Component: ExploreUserSystem
              },
              {
                path: blobsBlobId,
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
  // <StrictMode>
  <RouterProvider router={router} />
  // <AdvancedSearch />
  // </StrictMode>,  
);
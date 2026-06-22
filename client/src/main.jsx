// •  React
import React, { Component, StrictMode, Suspense, useEffect, useState, createContext, useRef, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useRouteError, NavLink, Outlet, useLoaderData, useNavigation, useLocation } from 'react-router-dom';
import chalk from 'chalk';

// • TailwindCSS
import './tailwind-setup.css';
import LoadingPage from './modules/loadingpage';

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

let animationId;

//// ─────────────────────────
//      OTHER
const canvasWidth = 450;
const canvasHeight = 450;


//  To catch the current location
let currentLocation = null;

//  Arc && arc animation
let x = 40;
let y = 40;

let rayon = 40;
let speed = 5;

// •   ExploreUserSystem default positions

// •   ExploreBlobSystem default positions


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
  const regexUserSystem = `^\/?${explore}\/systems\/[^/]+$`;
  const regexBlobId = `^\/${explore}\/systems.*\/blobs\/.*`;
  const regexBlob = new RegExp(regexBlobId);
  const regexUser = new RegExp(regexUserSystem);

  console.log(position)
  function draw(position) {
    switch (position) {
      case 'UpLeft':
        console.log("upleft");
        if (x > defaultPositionxUpLeft) {
          x -= speed;
        } else if (x < defaultPositionxUpLeft) {
          x += speed;
        } else if (y < defaultPositionyUpLeft) {
          y += speed;
        } else if (y > defaultPositionyUpLeft) {
          y -= speed;
        } else {
          console.log("DOWN");
          setPosition(null);
        }
        break;
      case 'UpRight':
        console.log("UpRight");
        if (x > defaultPositionxUpRight) {
          x -= speed;
        } else if (x < defaultPositionxUpRight) {
          x += speed;
        } else if (y < defaultPositionyUpRight) {
          y += speed;
        } else if (y > defaultPositionyUpRight) {
          y -= speed;
        } else {
          console.log("DOWN");
          setPosition(null);
        };
        break;
      case 'DownLeft':
        console.log("DownLeft");
        if (x > defaultPositionxDownLeft) {
          x -= speed;
        } else if (x < defaultPositionxDownLeft) {
          x += speed;
        } else if (y < defaultPositionyDownLeft) {
          y += speed;
        } else if (y > defaultPositionyDownLeft) {
          y -= speed;
        } else {
          console.log("DOWN");
          setPosition(null);
        };
        break;
      case 'DownRight':
        console.log("DownRight");
        if (x > defaultPositionxDownRight) {
          x -= speed;
        } else if (x < defaultPositionxDownRight) {
          x += speed;
        } else if (y < defaultPositionyDownRight) {
          y += speed;
        } else if (y > defaultPositionyDownRight) {
          y -= speed;
        } else {
          console.log("DOWN");
          setPosition(null);
        };
        break;
      case null:
        console.log("NULL");
        break;
    };
    
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(draw);

    // Manage FPS
    current = Date.now();
    consumedTime = current - lastFrameTime;

    // canvas content
    if (consumedTime > intervalOffps) {
      let canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(x, y, rayon, 0, 2 * Math.PI);
      ctx.stroke();


      /*
      //  ExploreUserSystem
      if (regexUser.test(location.pathname)) {

        // Animation
        if (animation === "exploreusersystem") {
          ctx.fillStyle = '#386c38';
          ctx.fill();
          if (direction.current === "left") {
            x += speed;
            if (x >= canvasWidth - rayon) {
              direction.current = "right";
            }
          } else {
            x -= speed;
            if (x <= rayon) {
              direction.current = "left";
            }
          }
        }
      }

      //  ExploreBlobSystem
      else if (regexBlob.test(location.pathname)) {
        ctx.fillStyle = '#191d73';
        ctx.fill();
        if (direction2.current === "up") {
          y += speed;
          if (y >= (canvasHeight - rayon)) {
            direction2.current = "down";
          }
        } else {
          y -= speed;
          if (y <= rayon) {
            direction2.current = "up";
          }
        }
      } else {
        console.log("%cDoesn't work", "color: #830c0c; font-weight: bold;");
      };
      */
    };
  };

  useEffect(() => {
    draw();
  }, [canvasRef, location.pathname]);

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
    <button onClick={handleClickUpLeft} className='hover:opacity-[50%]'>upleft</button>
    <button onClick={handleClickUpRight} className='hover:opacity-[50%]'>upright</button><br />

    <button onClick={handleClickDownLeft} className='hover:opacity-[50%]'>downleft</button>
    <button onClick={handleClickDownRight} className='hover:opacity-[50%]'>downright</button>
    <hr />
    <Outlet />
    <canvas className="border-2 border-black-500" id="tutoriel" width={canvasWidth} height={canvasHeight} ref={canvasRef}>
      <h1>Le canvas n'est pas supporté...</h1>
    </canvas>
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
  // </StrictMode>,
);
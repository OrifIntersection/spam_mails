// • React
import { useState, useEffect, useNavigate } from 'react';
import LoadingPage from './modules/loadingpage.jsx';
import IntroPage from './modules/intro.jsx';

// • TailwindCSS
import './tailwind-setup.css';

function App() {
  const [page, setPage] = useState(1);

  // •  Définir un nombre random entre 5000 et 7000
  function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (minCeiled - maxFloored) + maxFloored);
  }

  // •  Temps de chargement
  useEffect(() => {
    setTimeout(() => {
      setPage(2);
      console.log("RAPIDE")
    },
      200
      //getRandomInt(5870, 9500)
    );

  }, []);

  // •  Gestion des pages
  switch (page) {
    case 1:
      return (<>
        <LoadingPage />
      </>)
    case 2:
      return (<>
        <IntroPage />
      </>)

    case 3:
      return (<div className="bg-black text-white p-10">
        ERROR
      </div>)
  };

}

export default App;

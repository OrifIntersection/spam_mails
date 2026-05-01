import { useState } from 'react';
import FrontPage from './modules/frontpage';
import './tailwind-setup.css';

function App() {
  const [page, setPage] = useState(1);

  switch (page) {
    case 1:
      return (<>
        <FrontPage />
      </>)

    case 2:
      return (<div className="bg-black text-white p-10">
      </div>)
  };
}

export default App;

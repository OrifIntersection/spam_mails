import { useRouteError } from 'react-router-dom';

 
export default function ErrorPage() {
  const error = useRouteError();
  return (
    <div style={{ padding: '20px', color: 'red' }}>
      <h1>Une erreur est survenue</h1>
      <p>{error.status === 404 ? "Page ou donnée non trouvée" : (error.statusText || error.message)}</p>
    </div>
  );
}
import { Suspense } from "react";
import { useLoaderData, Await } from "react-router-dom";
import LoadingPage from "./loadingpage";

export default function Onboarding() {
  // On récupère la promesse différée
  const data = useLoaderData(); 

  return (
    <Suspense fallback={<LoadingPage content={"HEY"} bg={"bg1"}/>}>
      <Await resolve={data.donneesLentes}>
        <div>
          Onboarding
        </div>
      </Await>
    </Suspense>
  );
}
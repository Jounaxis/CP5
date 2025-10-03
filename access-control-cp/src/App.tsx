
import { lazy, Suspense } from "react";

const OutletsPage = lazy(() => import("react-router-dom").then(module => ({ default: module.Outlet })));

export default function App() {

  return (
    
    <div className="container">
      <Suspense fallback={<div>Loading...</div>}>  
        <OutletsPage />
      </Suspense>
    </div>
   
  );
}
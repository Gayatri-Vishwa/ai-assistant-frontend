import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, useContext, Suspense } from "react";
import { userDataContext } from "./context/userContext";
import ProtectedRoute from "./ProtectedRoute";


import SignUp from "./pages/SignUp";
import Home from "./pages/Home";

const SignIn = lazy(() => import("./pages/SignIn"));
const Customize = lazy(() => import("./pages/Customize"));
const Customize2 = lazy(() => import("./pages/Customize2"));

function App() {
  const { userData } = useContext(userDataContext);

  // ⏳ wait till auth resolved
  if (userData === undefined) {
    return <div>Checking auth...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* PUBLIC */}
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/customize" />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to="/customize" />}
        />

        {/* PROTECTED */}
        <Route
          path="/customize"
          element={userData ? <Customize /> : <Navigate to="/signin" />}
        />
        <Route
          path="/customize2"
          element={userData ? <Customize2 /> : <Navigate to="/signin" />}
        />

      
        {/* <Route
          path="/"
          element={
            userData ? <Home /> : <Navigate to="/signin" />
          }
        /> */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

      
      </Routes>
    </Suspense>
  );
}

export default App;

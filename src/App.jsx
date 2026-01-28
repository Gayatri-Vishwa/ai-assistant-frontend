

import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, useContext, Suspense } from "react";
import { userDataContext } from "./context/userContext";

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
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to="/" />}
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

        {/* HOME */}
        {/* <Route path="/" element={(userData?.assistantImage && userData?.assistantName )? <Home/>:<Navigate to={'/customize'}/>} /> */}
        
        <Route
          path="/"
          element={
            userData ? <Home /> : <Navigate to="/signin" />
          }
        />

      </Routes>
    </Suspense>
  );
}

export default App;



















// import { Navigate, Route, Routes } from "react-router-dom"
// // import SignIn from "./pages/SignIn"
// import SignUp from "./pages/SignUp"
// // import Customize from "./pages/Customize"
// // import Customize2 from "./pages/Customize2"
// import { lazy, useContext,Suspense } from "react"
// // import { userDataContext } from "./context/UserContext"
// import Home from "./pages/Home"
// import { userDataContext } from "./context/userContext"

// const SignIn =lazy(()=>import('./pages/SignIn'))
// // const SignUp =lazy(()=>import('./pages/SignUp'))
// const Customize =lazy(()=>import('./pages/Customize'))

// const Customize2 =lazy(()=>import('./pages/Customize2'))


// function App() {
//   const {userData}=useContext(userDataContext)

//   return (
//     <>
//  {/*  NO lazy loading */}
//       <Routes>
//         <Route
//           path="/signup"
//           element={!userData ? <SignUp /> : <Navigate to="/" />}
//         />
//       </Routes>

//     <Suspense  fallback={<div>Loading...</div>}> 
//    <Routes>
      
//      <Route path="/" element={(userData?.assistantImage && userData?.assistantName )? <Home/>:<Navigate to={'/customize'}/>} />
//     {/* <Route path="/signup" element={!userData? <SignUp/> :<Navigate to={'/'}/>} /> */}
//     <Route path="/signin" element={!userData? <SignIn/> :<Navigate to={'/'}/>} />
  
//     <Route path="/customize" element={userData?<Customize/>: <Navigate to={'/signup'}/> }/>
//     <Route path="/customize2" element={userData?<Customize2/>: <Navigate to={'/signup'}/> }/>


//    </Routes>
// </Suspense>


//     </>
//   )
// }

// export default App

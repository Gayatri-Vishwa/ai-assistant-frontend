import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { userDataContext } from "./context/userContext";

export default function ProtectedRoute({ children }) {
  const { userData } = useContext(userDataContext);

  if (userData === undefined) return <div>Checking auth...</div>;
  if (!userData) return <Navigate to="/signin" />;

  return children;
}

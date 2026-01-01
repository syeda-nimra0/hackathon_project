import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, children }) {
  // Agar user login nahi hai
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Agar login hai to page allow
  return children;
}

export default ProtectedRoute;

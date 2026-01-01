

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentBio from "./pages/StudentBio";
import Courses from "./pages/Courses";
import IDCard from "./pages/IDCard";

import ProtectedRoute from "./components/ProtectedRoute";
import { listenAuthState } from "./firebase/authState";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenAuthState((u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ color: "white", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to={user ? "/student-bio" : "/login"} />} />

        {/* Auth */}
        <Route path="/login" element={user ? <Navigate to="/student-bio" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/student-bio" /> : <Signup />} />

        {/* Protected Pages */}
        <Route
          path="/student-bio"
          element={
            <ProtectedRoute user={user}>
              <StudentBio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute user={user}>
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/id-card"
          element={
            <ProtectedRoute user={user}>
              <IDCard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;


import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "../App.css";
import { Link } from "react-router-dom";

function Login() {
  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputFields({
      ...inputFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        inputFields.email,
        inputFields.password
      );
      alert("Login Successful ✅");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google Login Successful ✅");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h2>Welcome Back!</h2>

        {/* Social Login Buttons */}
        <div className="social-login">
          <button className="social-btn" onClick={handleGoogleLogin} type="button">
            <i className="fab fa-google"></i>
          </button>
          <button className="social-btn" type="button">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="social-btn" type="button">
            <i className="fab fa-linkedin-in"></i>
          </button>
        </div>

        <div className="divider">or use your email for registration</div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <span className="input-icon">✉</span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={inputFields.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={inputFields.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Sign In</button>
        </form>

        <p className="switch-text">
          Don't have an account?
          <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
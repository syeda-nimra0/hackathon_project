import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "../App.css";
import { Link } from "react-router-dom";

function Signup() {
  const [inputFields, setInputFields] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputFields({
      ...inputFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(
        auth,
        inputFields.email,
        inputFields.password
      );
      alert("Signup Successful 🎉");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google Signup Successful ✅");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h2>Create Account</h2>

        {/* Social Login Buttons */}
        <div className="social-login">
          <button className="social-btn" onClick={handleGoogleSignup} type="button">
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

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={inputFields.name}
              onChange={handleChange}
              required
            />
          </div>

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

          <button type="submit">Sign Up</button>
        </form>

        <p className="switch-text">
          Already have an account?
          <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
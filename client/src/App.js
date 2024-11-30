import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import ChatRoom from "./ChatRoom";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute

const Login = ({ setToken, setEmail, setPassword, email, password }) => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      alert("Login successful");
      navigate("/chat"); // Redirect to the chat room
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/register")}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
          }}
        >
          Register here!
        </button>
      </p>
    </div>
  );
};

const Register = ({ setEmail, setPassword, email, password }) => {
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      console.log("Attempting to register with email:", email);

      const response = await axios.post("http://127.0.0.1:8080/api/register", {
        email,
        password,
      });

      if (response.status === 201) {
        alert("Registration successful! Please log in.");
        navigate("/"); // Redirect to login after registration
      } else {
        console.log("Unexpected response:", response);
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      if (err.response) {
        alert(
          err.response.data.message || "Registration failed. Please try again."
        );
      } else if (err.request) {
        alert("No response from the server. Check if the server is running.");
      } else {
        alert(
          "Registration failed due to a network error. Check your connection."
        );
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account?{" "}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
          }}
        >
          Login here
        </button>
      </p>
    </div>
  );
};

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      console.log("User is not logged in.");
    } else {
      console.log("User is logged in with token:", token);
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setToken={setToken}
              setEmail={setEmail}
              setPassword={setPassword}
              email={email}
              password={password}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              setEmail={setEmail}
              setPassword={setPassword}
              email={email}
              password={password}
            />
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

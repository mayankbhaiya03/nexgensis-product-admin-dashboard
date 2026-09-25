"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If user is already logged in, redirect to /products
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/products");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!username.trim() && !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const data = await login(username, password);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      router.push("/products");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("Invalid username or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Don't show the form while checking auth status
  if (checkingAuth) {
    return null;
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Product Admin Dashboard</p>

        <form onSubmit={handleSubmit} noValidate>
          {error && <p className="login-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

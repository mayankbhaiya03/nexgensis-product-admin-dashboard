"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.replace("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div>
          <h1 className="navbar-title">Products</h1>
          <p className="navbar-subtitle">Manage your products</p>
        </div>
        <button onClick={handleLogout} className="btn btn-logout">
          Logout
        </button>
      </div>
    </header>
  );
}

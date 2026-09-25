import api from "@/lib/axios";

// POST /auth/login — returns accessToken, refreshToken, and user data
export async function login(username, password) {
  const res = await api.post("/auth/login", { username, password });
  return res.data;
}

// GET /auth/me — returns the currently logged-in user using the stored token
export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data;
}

// POST /auth/refresh — exchanges a refresh token for a new access token
export async function refreshToken(refreshToken) {
  const res = await api.post("/auth/refresh", {
    refreshToken,
    expiresInMins: 60,
  });
  return res.data;
}

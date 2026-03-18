// src/services/api.js
const API_BASE = "https://medi-app-1ujt.onrender.com/api"; // 

export async function apiRequest(endpoint, method = "POST", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "API request failed");
  }

  return res.json();
}
// src/services/userService.js
import { apiRequest } from "./api";

export async function registerUser(userData) {
  return apiRequest("/users/register", "POST", userData);
}

export async function loginUser(credentials) {
  return apiRequest("/users/login", "POST", credentials);
}
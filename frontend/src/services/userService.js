// src/services/userService.js


import {apiRequest} from './api';

export async function login(email, password, role) {
  const response = await apiRequest("/users/login", "POST", { email, password, role });
  return response;
}

export async function registerUser(userData) {
  const response = await apiRequest("/users/register", "POST", userData);
  return response;
}
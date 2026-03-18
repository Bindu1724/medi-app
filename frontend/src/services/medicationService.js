// src/services/medicationService.js
import { apiRequest } from "./api";

export async function getMedications(userId, token) {
  return apiRequest(`/medications?userId=${userId}`, "GET", null, token);
}

export async function addMedication(medication, token) {
  return apiRequest("/medications", "POST", medication, token);
}

export async function updateMedication(id, medication, token) {
  return apiRequest(`/medications/${id}`, "PUT", medication, token);
}

export async function deleteMedication(id, token) {
  return apiRequest(`/medications/${id}`, "DELETE", null, token);
}
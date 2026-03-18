export function loginUser({ token, role, name, gender, userId }) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('name', name);
  localStorage.setItem("userId", userId);
  localStorage.setItem("gender", gender);

}

export function logoutUser() {
  localStorage.clear();
}

export function getUser() {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    name: localStorage.getItem('name'),
    userId: localStorage.getItem('userId'),
    gender:localStorage.getItem('gender'),
  };
}
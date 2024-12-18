export const isAdminAuthenticated = () => {
  const token = localStorage.getItem("adminToken");
  return token !== null;
};

export const loginAdmin = (token) => {
  localStorage.setItem("adminToken", token);
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
};

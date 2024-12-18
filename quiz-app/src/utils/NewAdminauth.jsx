export const isNewAdminAuthenticated = () => {
    const token = localStorage.getItem("admin_id");
    return token !== null;
  };
  
  export const loginAdmin = (token) => {
    localStorage.setItem("admin_id", admin_id);
  };
  
  export const logoutAdmin = () => {
    localStorage.removeItem("admin_id");
  };
  
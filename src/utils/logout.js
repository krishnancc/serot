export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.clear();

  // optional: clear session storage
  sessionStorage.clear();

  // redirect to login
  window.location.href = "/signin";
};

export const logoutUser = () => {
  localStorage.removeItem("serot_token");
  localStorage.clear();

  // optional: clear session storage
  sessionStorage.clear();

  // redirect to login
  window.location.href = "/signin";
};

import { axiosAuth, axiosSecured, axiosSecuredForm } from "./config.js";

const handleError = (err) => ({
  success: false,
  error: {
    message:
      err.response?.data?.message || err.message || "Server not reachable",
    statusCode: err.response?.status || 500,
    raw: err.response?.data,
  },
});
export const authSignIn = async (url, payload) => {
  const axiosClient = axiosAuth();

  try {
    const res = await axiosClient.post(url, payload);
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

export const getGeneric = async (url, payload) => {
  const axiosClient = axiosAuth();

  try {
    const res = await axiosClient.get(url, payload);
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

export const getMethod = async (url) => {
  const axiosClient = axiosSecured();
  const token = localStorage.getItem("serot_token");

  // console.log("Get method Del ", url);

  try {
    const res = await axiosClient.get(url);
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

export async function putFormData(url, postData) {
  const axiosClient = axiosSecuredForm();

  try {
    const res = await axiosClient.put(url, postData);
    return res.data;
  } catch (err) {
    return handleError(err);
  }
}

export const postMethod = async (url, payload) => {
  const axiosClient = axiosSecured();

  try {
    const res = await axiosClient.post(url, payload);
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

export async function postFormData(url, postData) {
  const axiosClient = axiosSecuredForm();

  try {
    const res = await axiosClient.post(url, postData);
    return res.data;
  } catch (err) {
    return handleError(err);
  }
}

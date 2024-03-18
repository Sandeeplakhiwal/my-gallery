import axios from "axios";
import { Server } from "../redux/store";

export const SignupApi = (formData: {
  name: string;
  email: string;
  password: string;
}) => {
  return axios.post(`${Server}/auth/register`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const LoginApi = (formData: { email: string; password: string }) => {
  return axios.post(`${Server}/auth/login`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const authApi = () => {
  return axios.get(`${Server}/me`, {
    withCredentials: true,
  });
};

export const createNewPostApi = (formData: FormData) => {
  console.log({ formData });
  return axios.post(`${Server}/post/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

export const deletePostApi = (id: string) => {
  return axios.delete(`${Server}/post/${id}`, {
    withCredentials: true,
  });
};

export const LogoutApi = () => {
  return axios.get(`${Server}/auth/logout`, {
    withCredentials: true,
  });
};

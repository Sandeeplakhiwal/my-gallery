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

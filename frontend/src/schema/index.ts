import * as Yup from "yup";

export const LoginSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(6).max(20).required("Please enter your password"),
});

export const SignupSchema = Yup.object({
  name: Yup.string().min(2).max(30).required("Please enter you name"),
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(6).max(20).required("Please enter your password"),
});

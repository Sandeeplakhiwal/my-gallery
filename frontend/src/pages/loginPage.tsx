import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as PageRoutes from "../constants/routes";
import { useFormik } from "formik";
import { LoginSchema } from "../schema";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginApi } from "../utils/apis";

function LoginPage() {
  useEffect(() => {
    document.title = "Login Page - My Gallery";
    const metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    metaDescription.content =
      "Login to My Gallery with your credentials to access exclusive event management services.";
    document.head.appendChild(metaDescription);

    return () => {
      document.head.removeChild(metaDescription);
    };
  }, []);

  const initialValues = {
    email: "",
    password: "",
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: LoginData,
    error: LoginError,
    mutateAsync,
    isPending,
  } = useMutation({
    mutationKey: ["login"],
    mutationFn: LoginApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate(PageRoutes.HOME);
      toast.success("Logged in successfully");
    },
    onError: (error) => {
      if (error) {
        if (isAxiosError(error) && error?.message === "Network Error") {
          toast.error("Network error");
        }

        if (isAxiosError(error) && error.response && error.response.data) {
          const errorMessage = (error.response.data as { error: string }).error;
          toast.error(errorMessage);
        }
      }
    },
  });

  const { errors, values, handleSubmit, handleBlur, handleChange } = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, action) => {
      mutateAsync(values);
      action.resetForm();
    },
  });

  async function submitHandler(event: FormEvent) {
    event.preventDefault();
    handleSubmit();
  }

  console.log({ values });
  console.log({ LoginData: LoginData });
  console.log({ LoginError: LoginError });

  return (
    <Container maxWidth={"xs"} sx={{ mx: "auto" }}>
      <Box display={"flex"} flexDirection={"column"}>
        <Box textAlign={"center"} mt={2}>
          <Typography
            variant="h5"
            gutterBottom
            textTransform={"uppercase"}
            color={"blueviolet"}
            fontFamily={"serif"}
          >
            Login to{" "}
            <Link to={PageRoutes.HOME} style={{ textDecoration: "none" }}>
              My Gallery
            </Link>
          </Typography>
          <form onSubmit={(e) => submitHandler(e)}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              required
              size={"small"}
              name="email"
              id="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              error={errors.email ? true : false}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              required
              size={"small"}
              name="password"
              id="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              error={errors.password ? true : false}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              style={{ marginTop: "1rem" }}
            >
              {isPending ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Box>
        <Typography variant={"subtitle2"} textAlign={"center"} marginTop={3}>
          New User? <Link to={PageRoutes.REGISTER}>Sign up</Link> here
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginPage;

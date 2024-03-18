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
import { useMutation } from "@tanstack/react-query";
import { SignupApi } from "../utils/apis";
import { useFormik } from "formik";
import { SignupSchema } from "../schema";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { loadUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

function SignupPage() {
  useEffect(() => {
    document.title = "Signup - My Gallery";
    const metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    metaDescription.content =
      "Signup to My Gallery with your credentials to access site without any interuption.";
    document.head.appendChild(metaDescription);

    return () => {
      document.head.removeChild(metaDescription);
    };
  }, []);

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: SignupData,
    error: SignupError,
    mutateAsync,
    isPending,
  } = useMutation({
    mutationKey: ["signup"],
    mutationFn: SignupApi,
    onSuccess: (data) => {
      dispatch(loadUser(data.data?.user));
      navigate(PageRoutes.HOME);
      toast.success("Registered successfully");
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
    validationSchema: SignupSchema,
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
  console.log({ SignupData });
  console.log({ SignupError });

  return (
    <Container maxWidth={"xs"} sx={{ mx: "auto" }}>
      <Box textAlign={"center"} mt={2}>
        <Typography
          variant="h5"
          gutterBottom
          textTransform={"uppercase"}
          //   fontWeight={"bold"}
          color={"blueviolet"}
          fontFamily={"serif"}
        >
          Signup to{" "}
          <Link to={PageRoutes.HOME} style={{ textDecoration: "none" }}>
            My Gallery
          </Link>
        </Typography>
        <form onSubmit={(e) => submitHandler(e)}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            type="text"
            required
            size={"small"}
            name="name"
            id="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            error={errors.name ? true : false}
          />

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
              "Sign Up"
            )}
          </Button>
        </form>
      </Box>
      <Typography variant={"subtitle2"} textAlign={"center"} marginTop={3}>
        Already have an account? <Link to={PageRoutes.LOGIN}>Login</Link> here
      </Typography>
    </Container>
  );
}

export default SignupPage;

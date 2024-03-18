import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import * as PageRoutes from "./constants/routes";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import CreatePostPage from "./pages/createPostPage.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store.ts";
import { authApi } from "./utils/apis.ts";
import { useQuery } from "@tanstack/react-query";
import { loadUser } from "./redux/slices/userSlice.ts";
import AppFallback from "./constants/appFallback.tsx";

// Imported Pages as Lazy import
const HomePage = lazy(() => import("./pages/homePage.tsx"));
const LoginPage = lazy(() => import("./pages/loginPage.tsx"));
const SignupPage = lazy(() => import("./pages/signupPage.tsx"));
// const AppLoader = lazy(() => import("./components/layout/appLoader.tsx"));

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const {
    data: authData,
    isSuccess,
    isLoading: authLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: authApi,
  });
  useEffect(() => {
    if (authData && isSuccess) {
      dispatch(loadUser(authData?.data));
    }
  }, [authData, isSuccess]);
  return authLoading ? (
    <AppFallback />
  ) : (
    <Router>
      <Suspense fallback={<AppFallback />}>
        <Routes>
          <Route
            path={PageRoutes.HOME}
            element={isAuthenticated ? <HomePage /> : <LoginPage />}
          />
          <Route path={PageRoutes.LOGIN} element={<LoginPage />} />
          <Route path={PageRoutes.REGISTER} element={<SignupPage />} />
          <Route
            path={PageRoutes.NOT_FOUND}
            element={isAuthenticated ? <HomePage /> : <LoginPage />}
          />
          <Route
            path={PageRoutes.CREATE_POST}
            element={isAuthenticated ? <CreatePostPage /> : <LoginPage />}
          />
        </Routes>
      </Suspense>
      <Toaster position={"bottom-center"} />
    </Router>
  );
}

export default App;

import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserInitialStateType } from "./slices/userSlice";

export type RootState = {
  user: UserInitialStateType;
};

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export const Server = "https://my-gallery-1c82.onrender.com/api/v1";

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

export const Server = "http://localhost:5000/api/v1";

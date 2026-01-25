import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import type { Roles } from "../types/enums";
import type { RootState } from "./store.ts";

interface UserState {
  id: string | null;
  isAuth: boolean;
  role: Roles | null;
  user: {
    firstname: string;
    lastname: string;
    email: string;
  } | null;
}

const initialState: UserState = {
  id: null,
  isAuth: false,
  role: null,
  user: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuth = false;
      state.id = null;
      state.role = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.isAuth = true;

        state.user = {
          firstname: payload.userResponseDto.firstname,
          lastname: payload.userResponseDto.lastname,
          email: payload.userResponseDto.email
        };

        state.id = String(payload.userResponseDto.id);
        state.role = payload.userResponseDto.role;

        localStorage.setItem("token", payload.tokenDto.accessToken);
        localStorage.setItem("refreshToken", payload.tokenDto.refreshToken);
      }
    );
  }
});

export const { logout } = userSlice.actions;
export const selectUserProfile = (state: RootState) => state.user.user;
export default userSlice.reducer;
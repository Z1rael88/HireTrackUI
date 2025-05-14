import {createSlice} from '@reduxjs/toolkit';
import {authApi} from '../api/apiSlice';
import type {Roles} from '../types/authUserTypes/RegisterUserType';

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
    user: null,

};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuth = false;
            state.id = null;
            state.role = null;
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, {payload}: any) => {
                    state.isAuth = true;
                    state.user = {
                        firstname: payload.userResponseDto.firstname,
                        lastname: payload.userResponseDto.lastname,
                        email: payload.userResponseDto.email,
                    };
                    state.id = payload.userResponseDto.id.toString();
                    state.role = payload.userResponseDto.role;
                    localStorage.setItem('token', payload.tokenDto.accessToken);
                    localStorage.setItem('refreshToken', payload.tokenDto.refreshToken);
                }
            )
            .addMatcher(authApi.endpoints.refresh.matchFulfilled, (state, {payload}) => {
                    localStorage.setItem('token', payload.accessToken);
                    localStorage.setItem('refreshToken', payload.refreshToken);
                    state.isAuth = true;
                }
            );
    },
});

export const {logout} = userSlice.actions;
export default userSlice.reducer;

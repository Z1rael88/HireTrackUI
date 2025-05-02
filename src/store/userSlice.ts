import {createSlice} from '@reduxjs/toolkit';
import {authApi} from '../api/authApiSlice';
import {Roles} from '../types/authUserTypes/RegisterUserType.ts';

interface UserState {
    id: string | null;
    isAuth: boolean;
    role: Roles | null;
    user: {
        firstname: string;
        lastname: string;
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
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                state.isAuth = true;
                state.user = action.payload.userResponseDto;
                state.id = action.payload.userResponseDto.id.toString();
                state.role = mapRole(action.payload.userResponseDto.role);
                localStorage.setItem('token', action.payload.tokenDto.accessToken);
                localStorage.setItem('refreshToken', action.payload.tokenDto.refreshToken);
            })
            .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
                state.isAuth = false;
                state.id = null;
                state.role = null;
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            })
            .addMatcher(authApi.endpoints.refresh.matchFulfilled, (state, action) => {
                const accessToken = (action.payload as any).accessToken;
                const refreshToken = (action.payload as any).refreshToken;
                localStorage.setItem("token", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                state.isAuth = true;
            })
    },
});

const mapRole = (role: number): Roles => {
    if (role === 3) return 3;
    return 2;
};

export const {logout} = userSlice.actions;
export default userSlice.reducer;
import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking',
        email: null,
        id: null
    },
    reducers: {
        onChecking: (state) => {
            state.status = 'checking'
            state.email = null
            state.password = null
            state.id = null
        },
        onLogin: (state, { payload }) => {
            state.status = 'auth'
            state.email = payload.email
            state.id = payload.id
        },
        onLogout: (state) => {
            state.status = 'not-auth'
            state.email = null
            state.id = null
        }
    },
})

export const { onChecking, onLogin, onLogout } = authSlice.actions

export default authSlice
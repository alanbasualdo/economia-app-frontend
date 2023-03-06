import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import { transactionsSlice } from "./transactionsSlice"

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        transactions: transactionsSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})
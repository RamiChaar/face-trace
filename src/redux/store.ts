import { configureStore } from '@reduxjs/toolkit'
import exampleReducer from './exampleSlice'

export const store = configureStore({
    reducer: {
        example: exampleReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {}
export type AppDispatch = typeof store.dispatch
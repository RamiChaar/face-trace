import { configureStore } from '@reduxjs/toolkit'
import videoReducer from './videoSlice'


export const store = configureStore({
    reducer: {
        videoState: videoReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {}
export type AppDispatch = typeof store.dispatch
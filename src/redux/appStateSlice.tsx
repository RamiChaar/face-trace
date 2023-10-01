import { createSlice } from '@reduxjs/toolkit'

export interface appState {
    page: string,
}

const initialState : appState = {
    page: 'video',
}

export const appStateSlice = createSlice({
    name: 'appState',
    initialState,
    reducers: {
      setToVideo: (state) : void=> {
        state.page = 'video'
      },
      setToImage: (state) : void => {
        state.page = 'image'
      }
    }
})

export const { setToVideo, setToImage } = appStateSlice.actions

export default appStateSlice.reducer
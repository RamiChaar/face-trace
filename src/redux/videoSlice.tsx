import { createSlice } from '@reduxjs/toolkit'

export interface VideoState {
  playing: boolean,
  modelsLoaded: boolean
}

const initialState: VideoState = {
    playing: false,
    modelsLoaded: false
}

export const VideoState = createSlice({
    name: 'videoState',
    initialState,
    reducers: {
        setVideoStart: (state) => {
            state.playing = true
        },
        setVideoEnd: (state) => {
            state.playing = false
        },
        setModelsLoaded: (state) => {
            state.modelsLoaded = true
        }
    },
})

export const { setVideoStart, setVideoEnd, setModelsLoaded } = VideoState.actions

export default VideoState.reducer
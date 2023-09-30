import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

let historyAverageCount = 5
export interface VideoState {
  playing: boolean,
  modelsLoaded: boolean,
  moodRecordCount : number, 
  moodLevels: {
    neutralLevels : number[],
    happyLevels : number[],
    sadLevels : number[],
    angryLevels : number[],
    disgustedLevels : number[],
    surprisedLevels : number[],
    fearfulLevels : number[]
  }
}

const initialState: VideoState = {
  playing: false,
  modelsLoaded: false,
  moodRecordCount: 0,
  moodLevels: {
    neutralLevels: new Array(historyAverageCount).fill(0),
    happyLevels: new Array(historyAverageCount).fill(0),
    sadLevels: new Array(historyAverageCount).fill(0),
    angryLevels: new Array(historyAverageCount).fill(0),
    disgustedLevels: new Array(historyAverageCount).fill(0),
    surprisedLevels: new Array(historyAverageCount).fill(0),
    fearfulLevels: new Array(historyAverageCount).fill(0)
  }
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
    },
    addMoodLevels: (state, action: PayloadAction<number[]>) => {
      let index = state.moodRecordCount % historyAverageCount
      
      state.moodLevels.neutralLevels[index] = action.payload[0]
      state.moodLevels.happyLevels[index] = action.payload[1]
      state.moodLevels.sadLevels[index] = action.payload[2]
      state.moodLevels.angryLevels[index] = action.payload[3]
      state.moodLevels.disgustedLevels[index] = action.payload[4]
      state.moodLevels.surprisedLevels[index] = action.payload[5]
      state.moodLevels.fearfulLevels[index] = action.payload[6]

      state.moodRecordCount += 1
    },
    resetMoodLevels: (state) => {
      for (let i = 0; i < historyAverageCount; i++) {
        state.moodLevels.neutralLevels[i] = 0
        state.moodLevels.happyLevels[i] = 0
        state.moodLevels.sadLevels[i] = 0
        state.moodLevels.angryLevels[i] = 0
        state.moodLevels.disgustedLevels[i] = 0
        state.moodLevels.surprisedLevels[i] = 0
        state.moodLevels.fearfulLevels[i] = 0
      }
    }
  },
})

export const { setVideoStart, setVideoEnd, setModelsLoaded, addMoodLevels, resetMoodLevels } = VideoState.actions

export default VideoState.reducer
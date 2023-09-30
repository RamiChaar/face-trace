import React, { useState , useRef, useEffect } from 'react';
import VideoStream from './components/VideoStream';
import Header from './components/Header';

//styling
import './styling/App.css';
import './styling/VideoStream.css';
import './styling/Header.css';


//Amplify imports
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-exports';

//redux imports
import type { RootState } from './redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setVideoStart, setVideoEnd, setModelsLoaded } from './redux/videoSlice'

//faceApi
import * as faceApi from 'face-api.js';

Amplify.configure(awsConfig);

export function App() {

  const isPlaying = useSelector((state: RootState) => state.videoState.playing)
  const dispatch = useDispatch()
  


  useEffect(()=>{
    loadModels()
  },[])

  const loadModels = async ()=>{
    const MODEL_URL = `./models`
    console.log('loading tinyFaceDetector...')
    await faceApi.nets.tinyFaceDetector.loadFromUri(MODEL_URL).catch((err)=>{console.error(err)})
    console.log('loading faceExpressionNet...')
    await faceApi.nets.faceExpressionNet.loadFromUri(MODEL_URL).catch((err)=>{console.error(err)})
    console.log('loading ageGenderNet...')
    await faceApi.nets.ageGenderNet.loadFromUri(MODEL_URL).catch((err)=>{console.error(err)})
    dispatch(setModelsLoaded())
    console.log('models loaded')
  }

  return (
    <div className='rootDiv'>
      
      <Header></Header>
      <VideoStream></VideoStream>

      {isPlaying ? 
      (<button onClick={() => dispatch(setVideoEnd())} className='toggleStreamButton'>End</button>) : 
      (<button onClick={() => dispatch(setVideoStart())} className='toggleStreamButton'>Start</button>)}
    </div>
  )
}

export default App
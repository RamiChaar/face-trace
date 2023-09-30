import React, { useState , useRef, useEffect } from 'react';
import VideoStream from './components/VideoStream';
import MoodMeters from './components/MoodMeters';
import Header from './components/Header';


//styling
import './styling/App.css';
import './styling/VideoStream.css';
import './styling/Header.css';
import './styling/MoodMeters.css';


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

  const dispatch = useDispatch()
  const isPlaying = useSelector((state: RootState) => state.videoState.playing)  

  
  useEffect(()=>{
    loadModels()
  },[])

  const loadModels = async()=>{
    await faceApi.nets.tinyFaceDetector.loadFromUri("./models").catch((err)=>{console.error(err)})
    await faceApi.nets.faceExpressionNet.loadFromUri("./models").catch((err)=>{console.error(err)})
    await faceApi.nets.ageGenderNet.loadFromUri("./models").catch((err)=>{console.error(err)})
    dispatch(setModelsLoaded())
  }

  return (
    <div className='rootDiv'>
      
      <Header></Header>
      {isPlaying ? 
      (<button onClick={() => dispatch(setVideoEnd())} className='toggleStreamButton'>End</button>) : 
      (<button onClick={() => dispatch(setVideoStart())} className='toggleStreamButton'>Start</button>)}

      <VideoStream></VideoStream>
      <MoodMeters></MoodMeters>

  
    </div>
  )
}

export default App
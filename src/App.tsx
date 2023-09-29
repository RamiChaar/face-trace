import React, { useState , useRef, useEffect } from 'react';
import './styling/App.css';

//Amplify imports
import { Amplify } from 'aws-amplify';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsConfig from './aws-exports';

//redux imports
import type { RootState } from './redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './redux/exampleSlice'

//faceApi
import * as faceApi from 'face-api.js';

Amplify.configure(awsConfig);

type Detection = faceApi.WithAge<faceApi.WithGender<faceApi.WithFaceExpressions<{ detection: faceApi.FaceDetection; }>>>;

export function App({signOut, user} : WithAuthenticatorProps) {
  /*============ redux example code
  const count = useSelector((state: RootState) => state.example.value)
  const dispatch = useDispatch()
  ============*/

  const [playing, setPlaying] = useState<boolean>(false)
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)


  const INTERVAL_TIME : number = 200
  

  useEffect(()=>{
    loadModels()
  },[])

  const loadModels = ()=>{
    Promise.all([
      faceApi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceApi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceApi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceApi.nets.faceExpressionNet.loadFromUri("/models"),
      faceApi.nets.ageGenderNet.loadFromUri("/models"),
    ]).then(()=>{
      console.log('models loaded')
    })
  }

  const startVideo = () => {

    navigator.mediaDevices.getUserMedia({
      video: {
        width: 1280, 
        height: 720
      }
    })
    .then(async(stream : MediaStream) => {
      if (!videoRef.current) {return}
      const video : HTMLVideoElement = videoRef.current
      video.srcObject = stream
      await video.play()
      video.style.zIndex = '0'
      setCurrentInterval(setInterval(detect, INTERVAL_TIME))
      setPlaying(true)
    })
    .catch((err) => {
      console.error(err)
    })

  }

  const stopVideo = async () => {

    if (!videoRef.current) {return}

    const video : HTMLVideoElement= videoRef.current

    let stream : any = video.srcObject 

    await stream.getTracks().forEach( function (track : MediaStreamTrack) {
      track.stop();
    })

    setPlaying(false)
    clearInterval(currentInterval)
    video.style.zIndex = '2'

  }

  const detect = async () => {
    if (!videoRef.current || !canvasRef.current) {return}

    const video : HTMLVideoElement = videoRef.current
    const canvas : HTMLCanvasElement = canvasRef.current

    const detections : Detection[] = await faceApi.detectAllFaces(video, new faceApi.TinyFaceDetectorOptions())
    .withFaceExpressions()
    .withAgeAndGender()

    const dimensions = {width:1280,height:720}
    faceApi.matchDimensions(canvas, dimensions)
    const resizedDetections : Detection[] = faceApi.resizeResults(detections, dimensions)

    for(let i : number = 0; i < detections.length; i++)  {

      const text : string[] = [
        `${detections[i].age.toFixed(1)} years`,
        `${detections[i].gender} (${detections[i].genderProbability.toFixed(2)})`
      ]

      const anchor : faceApi.IPoint = { x: detections[i].detection.box.x, y: detections[i].detection.box.y  + detections[i].detection.box.height}
      const drawBox : faceApi.draw.DrawTextField = new faceApi.draw.DrawTextField(text, anchor)
      drawBox.draw(canvas)

    }

    faceApi.draw.drawDetections(canvas,resizedDetections)

  }


  return (
    <>
      <h1>Hello {user?.username}</h1>
      <button onClick={signOut}>Sign out</button>

      <div className='videoStreamDiv'>
        
        <video ref={videoRef}  className='videoStream'></video>
        <canvas ref={canvasRef} width="720" height="560" className="canvasOverlay"/>

        {playing ? (<button onClick={stopVideo} className='toggleStreamButton'>End</button>) : (<button onClick={startVideo} className='toggleStreamButton'>Start</button>)}

      </div>

      {/* Redux Example JSX
      <div>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <span>{count}</span>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
      </div>
      Example Code */}
    </>
  );
}

export default withAuthenticator(App);
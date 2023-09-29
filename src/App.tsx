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
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false)
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>()


  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)


  const INTERVAL_TIME : number = 200
  

  useEffect(()=>{
    loadModels()
  },[])

  const loadModels = async ()=>{
    const MODEL_URL = `/models`
    console.log('loading models')

    const initModels = async () => {
      Promise.all([
        faceApi.loadTinyFaceDetectorModel(MODEL_URL),
        faceApi.loadFaceLandmarkModel(MODEL_URL),
        faceApi.loadFaceRecognitionModel(MODEL_URL),
        faceApi.loadFaceExpressionModel(MODEL_URL)
      ])
  }
  await initModels();

    console.log('loading tinyFaceDetector...')
    // await faceApi.nets.tinyFaceDetector.loadFromUri(MODEL_URL).catch((err)=>{console.error(err)})
    faceApi.loadTinyFaceDetectorModel(MODEL_URL)
    console.log('loading faceLandmark68Net...')
    // await faceApi.nets.faceLandmark68Net.loadFromUri(MODEL_URL).catch((err)=>{console.error(err)})
    faceApi.loadFaceLandmarkModel(MODEL_URL)

    console.log('loading faceRecognitionNet...')
    // await faceApi.nets.faceRecognitionNet.loadFromUri(MODEL_URL).catch((err)=>{console.error(err)})
    faceApi.loadFaceRecognitionModel(MODEL_URL)

    console.log('loading faceExpressionNet...')
    // await faceApi.nets.faceExpressionNet.loadFromUri(MODEL_URL).catch((err)=>{console.error(err)})
    faceApi.loadFaceExpressionModel(MODEL_URL)

    console.log('loading ageGenderNet...')
    // await faceApi.nets.ageGenderNet.loadFromUri(MODEL_URL).catch((err)=>{console.error(err)})
    faceApi.loadAgeGenderModel(MODEL_URL)

    setModelsLoaded(true)
    console.log('models loaded')
  }

  const startVideo = () => {

    if (!modelsLoaded) {
      console.warn('cannot start, models not loaded')
      return
    }

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
    .catch((err : string) => {console.error(err)})

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
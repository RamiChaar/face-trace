import React, { useState , useRef, useEffect } from 'react';

//redux imports
import type { RootState } from '../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { addMoodLevels, resetMoodLevels } from '../redux/videoSlice'

//faceApi
import * as faceApi from 'face-api.js';

type Detection = faceApi.WithAge<faceApi.WithGender<faceApi.WithFaceExpressions<{ detection: faceApi.FaceDetection; }>>>;

export function VideoStream() {


  const dispatch = useDispatch()
  const isPlaying = useSelector((state: RootState) => state.videoState.playing)
  const modelsLoaded = useSelector((state: RootState) => state.videoState.modelsLoaded)

  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const INTERVAL_TIME : number = 200

  useEffect(() => {
    if (isPlaying) {
      startVideo()
    } else {
      stopVideo()
    }
  }, [isPlaying])


  const startVideo = () => {

    if (!modelsLoaded) {
      console.log('cannot start yet, models not loaded')
      return
    }

    navigator.mediaDevices.getUserMedia({
      video: {
        width: 1280, 
        height: 720,
        facingMode: 'user'
      }
    })
    .then(async(stream : MediaStream) => {
      if (!videoRef.current) {
        return
      }

      const video : HTMLVideoElement = videoRef.current
      video.srcObject = stream
      await video.play()

      video.style.zIndex = '0'
      setCurrentInterval(setInterval(detect, INTERVAL_TIME))
    })
    .catch((err : string) => {console.error(err)})
  
  }
  
  const stopVideo = async () => {
  
    if (!videoRef.current || !videoRef.current.srcObject) {return}

    const video : HTMLVideoElement = videoRef.current

    let stream : any = video.srcObject 

    video.style.zIndex = '2'
    clearInterval(currentInterval)

    setTimeout(() => {
      stream.getTracks().forEach( function (track : MediaStreamTrack) {
        track.stop()
      })
    }, 100)

    dispatch(resetMoodLevels())
  
  }
  
  const detect = async () => {
    if (!videoRef.current || !canvasRef.current) {
      return
    }

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

    if (detections && detections.length > 0 && detections[0].expressions) {
      console.log(detections[0].expressions)

      let levelsArr : number[] = [
        detections[0].expressions.neutral,
        detections[0].expressions.happy,
        detections[0].expressions.sad,
        detections[0].expressions.angry,
        detections[0].expressions.disgusted,
        detections[0].expressions.surprised,
        detections[0].expressions.fearful
      ]

      dispatch(addMoodLevels(levelsArr))
    }

    faceApi.draw.drawDetections(canvas,resizedDetections)
  
  }

  return(
    <div className='videoStreamDiv'>
      <video ref={videoRef} className='videoStream'></video>
      <canvas ref={canvasRef} width="720" height="560" className="canvasOverlay"/>
      <div></div>
    </div>
  )
}

export default VideoStream
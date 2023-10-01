import React, { ChangeEvent, useState , useRef, useEffect } from 'react'

//faceApi
import * as faceApi from 'face-api.js';

//animation
import { Ring } from '@uiball/loaders'

type Detection = faceApi.WithAge<faceApi.WithGender<faceApi.WithFaceExpressions<{ detection: faceApi.FaceDetection; }>>>;

export function ImageUpload () {

  const [file, setFile] = useState<string | undefined>(undefined)
  const [imageKey, setImageKey] = useState<number>(0)
  const [wrongFileType, setWrongFileType] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [beganProcessing, setBeganProcessing] = useState<boolean>(false)

  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.addEventListener('resize', setDimensions);
    
    return () => {
      window.removeEventListener('resize', setDimensions);
    };
  },[])

  const setDimensions = () : void => {
    if (!imageRef.current || !canvasRef.current || !loadingRef.current) {
      return
    }
    canvasRef.current.style.height = `${imageRef.current.height}px`
    canvasRef.current.style.width = `${imageRef.current.width}px`
    loadingRef.current.style.height = `${imageRef.current.height}px`
    loadingRef.current.style.width = `${imageRef.current.width}px`
  }

  const runFaceDetection = async ()  => {
    if (!imageRef.current || !canvasRef.current || !loadingRef.current) {
      return
    }
    
    const image : HTMLImageElement = imageRef.current
    const canvas : HTMLCanvasElement = canvasRef.current

    const detections : Detection[] = await faceApi.detectAllFaces(image, new faceApi.TinyFaceDetectorOptions())
    .withFaceExpressions()
    .withAgeAndGender()

    const dimensions = {width: image.width ,height: image.height}
    faceApi.matchDimensions(canvas, dimensions)
    const resizedDetections : Detection[] = faceApi.resizeResults(detections, dimensions)

    for(let i : number = 0; i < detections.length; i++)  {

      const text : string[] = [
        `${resizedDetections[i].age.toFixed(1)} years`,
        `${resizedDetections[i].gender} (${resizedDetections[i].genderProbability.toFixed(2)})`
      ]

      if (detections[i].expressions.neutral > .1) {
        text.push(`neutral (${detections[i].expressions.neutral.toFixed(2)})`)
      }
      if (detections[i].expressions.happy > .1) {
        text.push(`happy (${detections[i].expressions.happy.toFixed(2)})`)
      }
      if (detections[i].expressions.sad > .1) {
        text.push(`sad (${detections[i].expressions.sad.toFixed(2)})`)
      }
      if (detections[i].expressions.angry > .1) {
        text.push(`angry (${detections[i].expressions.angry.toFixed(2)})`)
      }
      if (detections[i].expressions.disgusted > .1) {
        text.push(`disgusted (${detections[i].expressions.disgusted.toFixed(2)})`)
      }
      if (detections[i].expressions.surprised > .1) {
        text.push(`surprised (${detections[i].expressions.surprised.toFixed(2)})`)
      }
      if (detections[i].expressions.fearful > .1) {
        text.push(`fearful (${detections[i].expressions.fearful.toFixed(2)})`)
      }

      const anchor : faceApi.IPoint = { x: resizedDetections[i].detection.box.x, y: resizedDetections[i].detection.box.y  + resizedDetections[i].detection.box.height}
      const drawBox : faceApi.draw.DrawTextField = new faceApi.draw.DrawTextField(text, anchor)
      drawBox.draw(canvas)
    }

    faceApi.draw.drawDetections(canvas,resizedDetections)
    loadingRef.current.style.zIndex = '-1'
    setIsLoading(false)

  }


  const startFaceDetection = async () => {
    if (!imageRef.current || !canvasRef.current || !loadingRef.current) {
      return
    }

    canvasRef.current.style.height = `${imageRef.current.height}px`
    canvasRef.current.style.width = `${imageRef.current.width}px`
    loadingRef.current.style.height = `${imageRef.current.height}px`
    loadingRef.current.style.width = `${imageRef.current.width}px`
    loadingRef.current.style.zIndex = '1'
    canvasRef.current.style.zIndex = '-1'

    setIsLoading(true)
    setBeganProcessing(true)

    setTimeout(async () => {
      await runFaceDetection()

      setIsLoading(false)
      if(loadingRef.current && canvasRef.current) {
        loadingRef.current.style.zIndex = '-1'
        canvasRef.current.style.zIndex = '1'
      }
    }, 200)

  }

  const getFile = (event : ChangeEvent<HTMLInputElement>) : void => {

    removeFile()

    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    if (event.target.files[0].type.split('/')[0] !== "image") {
      setWrongFileType(true)
      return
    }

    setWrongFileType(false)
    setFile(URL.createObjectURL(event.target.files[0]))
  }

  const removeFile = () : void => {
    if (canvasRef.current && loadingRef.current) {
      canvasRef.current.style.height = `0`
      canvasRef.current.style.width = `0`
      loadingRef.current.style.height = `0`
      loadingRef.current.style.width = `0`
    }
    setImageKey(imageKey + 1)
    setFile(undefined)
    setBeganProcessing(false)
  }

  return (
    <>
      <input className='fileInput' type='file' onChange={getFile} key={imageKey}></input>
      <img ref={imageRef} className='selectedPhoto' src={file} key={imageKey + 1}></img>
      <canvas ref={canvasRef}className="canvasImageOverlay"/>
      <div ref={loadingRef} className='loadingImageOverlay'>
        {isLoading ? <Ring size={50} color="#E1E4F4"/> : <></>} 
      </div>

      {!wrongFileType ? <></> :
        <p><b>Unsupported File Type</b></p>
      }

      {file === undefined ? <></> :
        <div className='imageActionSelection'>
          <button className='startFaceDetection' onClick={startFaceDetection} disabled={beganProcessing}>
            run face detection
          </button> 
          <button className='deleteFile' onClick={removeFile}>delete</button> 
        </div>
      }

    </>
  )
}

export default ImageUpload
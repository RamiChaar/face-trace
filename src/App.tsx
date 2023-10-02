import { useEffect } from 'react';
import VideoStream from './components/VideoStream';
import MoodMeters from './components/MoodMeters';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';

//styling
import './styling/App.css';
import './styling/VideoStream.css';
import './styling/Header.css';
import './styling/MoodMeters.css';
import './styling/ImageUpload.css';

//Amplify imports
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-exports';

//redux imports
import type { RootState } from './redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setModelsLoaded } from './redux/videoSlice'

//faceApi
import * as faceApi from 'face-api.js';

Amplify.configure(awsConfig);

export function App() {

  const dispatch = useDispatch()

  const currentPage : string = useSelector((state: RootState) => state.appState.page)
  const playing : boolean = useSelector((state: RootState) => state.videoState.playing)
  
  useEffect(() => {
    loadModels()
  },[])

  const loadModels = async() => {
    await faceApi.nets.tinyFaceDetector.loadFromUri("./models").catch((err)=>{console.error(err)})
    await faceApi.nets.faceExpressionNet.loadFromUri("./models").catch((err)=>{console.error(err)})
    await faceApi.nets.ageGenderNet.loadFromUri("./models").catch((err)=>{console.error(err)})
    dispatch(setModelsLoaded())
  }

  return (
    <div className='rootDiv'>
      
      <Header></Header>

      <div className='pageBody'>
        {currentPage === 'video' || playing ?
          <div className='liveVideoDiv'>
            <VideoStream></VideoStream>
            <MoodMeters></MoodMeters>
          </div> 
          :
          <div className='uploadImageDiv'>
            <ImageUpload/>
          </div>
        }
      </div>

    </div>
  )
}

export default App
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

Amplify.configure(awsConfig);

export function App({ signOut, user }: WithAuthenticatorProps) {
  /*============ redux example code
  const count = useSelector((state: RootState) => state.example.value)
  const dispatch = useDispatch()
  ============*/

  const [playing, setPlaying] = useState<boolean>(false)


  const videoRef = useRef<HTMLVideoElement>(null)

  const startVideo = () => {
    console.log('click')
    if (playing) {
      return
    }

		navigator.mediaDevices.getUserMedia({
				video: {width: 1920, height: 1080}
			})
      .then(async (stream) => {

				let video = videoRef.current
        if(video) {
          video.srcObject = stream
          await video.play()
          setPlaying(true)
        } 

			})
      .catch((err) => {
        console.error(err)
      })
	}

	const stopVideo = () => {
		setPlaying(false)

    let video = videoRef.current
    if (!video) {return}

    let stream : any = video.srcObject

    if(!stream) {return}
  
    stream.getTracks().forEach( function (track : MediaStreamTrack) {
      track.stop();
    })

  }


  return (
    <>
      <h1>Hello {user?.username}</h1>
      <button onClick={signOut}>Sign out</button>

      <div className='videoStreamDiv'>
        <video ref={videoRef} className='videoStream'></video>

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
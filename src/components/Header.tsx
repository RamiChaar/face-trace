import {  useRef } from 'react'

//redux
import type { RootState } from '../redux/store'
import { useSelector , useDispatch} from 'react-redux'
import { setToVideo, setToImage } from '../redux/appStateSlice'

//icons
import { ImVideoCamera as VideoIcon, ImImage as ImageIcon} from "react-icons/im"


export function Header() {

  const dispatch = useDispatch()

  const currentPage = useSelector((state: RootState) => state.appState.page)

  const toggleRef = useRef<HTMLDivElement>(null)
  

  const selectVideo = () : void => {
    if (!toggleRef.current || currentPage === 'video') {
      return
    }

    dispatch(setToVideo())
    toggleRef.current.style.marginLeft = '0px'
  }

  const selectImage = () : void => {
    if (!toggleRef.current || currentPage === 'image') {
      return
    }

    dispatch(setToImage())
    toggleRef.current.style.marginLeft = '70px'
  }

  return (
    <div className='headerDiv'>
      <div className='toggleDiv'>
        <div ref={toggleRef} className='toggle'></div>
        <VideoIcon className="videoIcon" onClick={selectVideo}/>
        <ImageIcon className="imageIcon" onClick={selectImage}/>
      </div>
    </div>
  )
}

export default Header
import React, { useState , useRef, useEffect } from 'react';

//redux imports
import type { RootState } from '../redux/store'
import { useSelector , useDispatch} from 'react-redux'
import { resetMoodLevels } from '../redux/videoSlice'

//icon imports 
import { 
  ImNeutral as NeutralIcon, ImGrin as HappyIcon,
  ImSad as SadIcon, ImAngry as AngryIcon, ImConfused as DisgustedIcon, 
   ImShocked as SurprisedIcon, ImBaffled as FearfulIcon 
} from "react-icons/im";

type MoodInterface = { neutralLevels: number[]; happyLevels: number[]; sadLevels: number[]; angryLevels: number[]; disgustedLevels: number[]; surprisedLevels: number[]; fearfulLevels: number[]; }

export function MoodMeters() {

  const dispatch = useDispatch()

  const moodLevels = useSelector((state: RootState) => state.videoState.moodLevels)
  const isPlaying = useSelector((state: RootState) => state.videoState.playing)  

  const neutralLevel = useRef<HTMLDivElement>(null)
  const happyLevel = useRef<HTMLDivElement>(null)
  const sadLevel = useRef<HTMLDivElement>(null)
  const angryLevel = useRef<HTMLDivElement>(null)
  const disgustedLevel = useRef<HTMLDivElement>(null)
  const surprisedLevel = useRef<HTMLDivElement>(null)
  const fearfulLevel = useRef<HTMLDivElement>(null)

  const [dominantEmotion, setDominantEmotion] = useState<string>('none')

  useEffect(() => {
    if (isPlaying) {
      return
    }

    dispatch(resetMoodLevels())
    resetHeights()

  }, [isPlaying])

  useEffect(() : void => {

    setLevels(moodLevels)

  }, [moodLevels])


  const setLevels = (moodLevels: MoodInterface) : void => {
    if (!neutralLevel.current || !happyLevel.current || 
        !sadLevel.current || !angryLevel.current || 
        !disgustedLevel.current || !surprisedLevel.current || 
        !fearfulLevel.current || !isPlaying) {
      return
    }

    let neutralAverage : number = calculateAverage(moodLevels.neutralLevels) * 100
    neutralLevel.current.style.height = `${neutralAverage}%`
    
    let happyAverage : number = calculateAverage(moodLevels.happyLevels) * 100
    happyLevel.current.style.height = `${happyAverage}%` 

    let sadAverage : number = calculateAverage(moodLevels.sadLevels) * 100
    sadLevel.current.style.height = `${sadAverage}%`
    
    let angryAverage : number = calculateAverage(moodLevels.angryLevels) * 100
    angryLevel.current.style.height = `${angryAverage}%`

    let disgustedAverage : number = calculateAverage(moodLevels.disgustedLevels) * 100
    disgustedLevel.current.style.height = `${disgustedAverage}%`

    let surprisedAverage : number = calculateAverage(moodLevels.surprisedLevels) * 100
    surprisedLevel.current.style.height = `${surprisedAverage}%`

    let fearfulAverage : number = calculateAverage(moodLevels.fearfulLevels) * 100
    fearfulLevel.current.style.height = `${fearfulAverage}%` 

    if (neutralAverage >= 50) {
      setDominantEmotion('neutral')
    } else if (happyAverage >= 50) {
      setDominantEmotion('happy')
    } else if (sadAverage >= 50) {
      setDominantEmotion('sad')
    } else if (angryAverage >= 50) {
      setDominantEmotion('angry')
    } else if (disgustedAverage >= 50) {
      setDominantEmotion('disgusted')
    } else if (surprisedAverage >= 50) {
      setDominantEmotion('surprised')
    } else if (fearfulAverage >= 50) {
      setDominantEmotion('fearful')
    } else {
      setDominantEmotion('none')
    }

  }

  const calculateAverage = (numbers: number[]): number  => {

    if (numbers.length === 0) {
      return 0
    }
  
    const sum = numbers.reduce((acc, currentValue) => acc + currentValue, 0)
    return sum / numbers.length

  }

  const resetHeights = () : void => {
    if (!neutralLevel.current || !happyLevel.current || 
        !sadLevel.current || !angryLevel.current || 
        !disgustedLevel.current || !surprisedLevel.current || 
        !fearfulLevel.current) {
      return
    }


    neutralLevel.current.style.height = '0'
    happyLevel.current.style.height = '0'
    sadLevel.current.style.height = '0'
    angryLevel.current.style.height = '0'
    disgustedLevel.current.style.height = '0'
    surprisedLevel.current.style.height = '0'
    fearfulLevel.current.style.height = '0'

  }

  return (
    <div className='metersDiv'>

      <div className='meterContainer'>
        <div className='meter neutralMeter'>
          <div ref={neutralLevel} className='level neutralMeterLevel'></div>
        </div>
        <NeutralIcon className="icon" style={{color: dominantEmotion === "neutral" ? "#464646" : "#000000"}}/>
      </div>

      <div className='meterContainer'>
        <div className='meter happyMeter'>
          <div ref={happyLevel} className='level happyMeterLevel'></div>
        </div>
        <HappyIcon className="icon" style={{color: dominantEmotion === "happy" ? "#16940b" : "#000000"}}/>
      </div>

      <div className='meterContainer'>
        <div className='meter sadMeter'>
          <div ref={sadLevel} className='level sadMeterLevel'></div>
        </div>
        <SadIcon className="icon" style={{color: dominantEmotion === "sad" ? "#1055b0" : "#000000"}}/>
      </div>

      <div className='meterContainer'>
        <div className='meter angryMeter'>
          <div ref={angryLevel} className='level angryMeterLevel'></div>
        </div>
        <AngryIcon className="icon" style={{color: dominantEmotion === "angry" ? "#bf2113" : "#000000"}}/>
      </div>
      
      <div className='meterContainer'>
        <div className='meter disgustedMeter'>
          <div ref={disgustedLevel} className='level disgustedMeterLevel'></div>
        </div>
        <DisgustedIcon className="icon" style={{color: dominantEmotion === "disgusted" ? "#eb8d1a" : "#000000"}}/>
      </div>

      <div className='meterContainer'>
        <div className='meter surprisedMeter'>
          <div ref={surprisedLevel} className='level surprisedMeterLevel'></div>
        </div>
      <SurprisedIcon className="icon" style={{color: dominantEmotion === "surprised" ? "#f3e700" : "#000000"}}/>
      </div>

      <div className='meterContainer'>
        <div className='meter fearfulMeter'>
          <div ref={fearfulLevel} className='level fearfulMeterLevel'></div>
        </div>
        <FearfulIcon className="icon" style={{color: dominantEmotion === "fearful" ? "#6f2604" : "#000000"}}/>
      </div>

    </div>
  )
}

export default MoodMeters
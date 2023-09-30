import React, { useState , useRef, useEffect } from 'react';

import type { RootState } from '../redux/store'
import { useSelector } from 'react-redux'

type MoodInterface = { neutralLevels: number[]; happyLevels: number[]; sadLevels: number[]; angryLevels: number[]; disgustedLevels: number[]; surprisedLevels: number[]; fearfulLevels: number[]; }

export function MoodMeters() {

  const moodLevels = useSelector((state: RootState) => state.videoState.moodLevels)

  const neutralLevel = useRef<HTMLDivElement>(null)
  const happyLevel = useRef<HTMLDivElement>(null)
  const sadLevel = useRef<HTMLDivElement>(null)
  const angryLevel = useRef<HTMLDivElement>(null)
  const disgustedLevel = useRef<HTMLDivElement>(null)
  const surprisedLevel = useRef<HTMLDivElement>(null)
  const fearfulLevel = useRef<HTMLDivElement>(null)

  useEffect(() : void => {

    setLevels(moodLevels)

  }, [moodLevels])

  const setLevels = (moodLevels: MoodInterface) : void => {
    if (!neutralLevel.current || !happyLevel.current || 
        !sadLevel.current || !angryLevel.current || 
        !disgustedLevel.current || !surprisedLevel.current || 
        !fearfulLevel.current) {
      return
    }

    neutralLevel.current.style.height = `${calculateAverage(moodLevels.neutralLevels) * 100}%`
    happyLevel.current.style.height = `${calculateAverage(moodLevels.happyLevels) * 100}%`
    sadLevel.current.style.height = `${calculateAverage(moodLevels.sadLevels) * 100}%`
    angryLevel.current.style.height = `${calculateAverage(moodLevels.angryLevels) * 100}%`
    disgustedLevel.current.style.height = `${calculateAverage(moodLevels.disgustedLevels) * 100}%`
    surprisedLevel.current.style.height = `${calculateAverage(moodLevels.surprisedLevels) * 100}%`
    fearfulLevel.current.style.height = `${calculateAverage(moodLevels.fearfulLevels) * 100}%`

  }

  const calculateAverage = (numbers: number[]): number  => {

    if (numbers.length === 0) {
      return 0
    }
  
    const sum = numbers.reduce((acc, currentValue) => acc + currentValue, 0)
    return sum / numbers.length

  }


  return (
    <div className='metersDiv'>
      <div className='meter neutralMeter'>
        <div ref={neutralLevel} className='level neutralMeterLevel'></div>
      </div>
      <div className='meter happyMeter'>
        <div ref={happyLevel} className='level happyMeterLevel'></div>
      </div>
      <div className='meter sadMeter'>
        <div ref={sadLevel} className='level sadMeterLevel'></div>
      </div>
      <div className='meter angryMeter'>
        <div ref={angryLevel} className='level angryMeterLevel'></div>
      </div>
      <div className='meter disgustedMeter'>
        <div ref={disgustedLevel} className='level disgustedMeterLevel'></div>
      </div>
      <div className='meter surprisedMeter'>
        <div ref={surprisedLevel} className='level surprisedMeterLevel'></div>
      </div>
      <div className='meter fearfulMeter'>
        <div ref={fearfulLevel} className='level fearfulMeterLevel'></div>
      </div>
    </div>
  )
}

export default MoodMeters
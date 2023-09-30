import React, { useState , useRef, useEffect } from 'react';


export function Header() {

  const [lightMode, setLightMode] = useState<boolean>(true)

  useEffect(() => {

    let mode = lightMode ? 'light' : 'dark'

    document.documentElement.style.setProperty(`--primary-color`, `var(--${mode}-primary-color)`)
    document.documentElement.style.setProperty(`--secondary-color`, `var(--${mode}-secondary-color)`)
    document.documentElement.style.setProperty(`--accent-color`, `var(--${mode}-accent-color)`)
    document.documentElement.style.setProperty(`--background-color`, `var(--${mode}-background-color)`)
    document.documentElement.style.setProperty(`--text-color`, `var(--${mode}-text-color)`)

  }, [lightMode])

  const changeMode = () => {
    if (lightMode) {
      setLightMode(false)
    } else {
      setLightMode(true)
    }
  }

  return (
    <div className='headerDiv'>
      <button onClick={changeMode}>changeMode</button>
    </div>
  )
}

export default Header
import React, { useEffect, useState } from 'react'
import './styles/app.css'
const App = () => {
  const [albumData, setAlbumData] = useState(null)
  const getAlbumData = async () => {
    // eslint-disable-next-line no-undef
    const response = await fetch('/api/albums/all')
    const data = await response.json()
    setAlbumData(data)
  }
  useEffect(() => {
    getAlbumData()
  }, [])

  useEffect(() => console.log(albumData), [albumData])

  return (
    <div style={{ backgroundColor: 'black' }}>

    </div>
  )
}
export default App

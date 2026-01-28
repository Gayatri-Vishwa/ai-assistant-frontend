import React from 'react'
import { useContext } from 'react'
import { userDataContext } from '../context/userContext'

function Card({image}) {
      const {
          setBackendImage,
          SelectedImage, 
          setSelectedImage,
          setFrontendImage}=useContext(userDataContext)
    
    
  return (
    <div onClick={()=>{
      setBackendImage(null)
      setFrontendImage(null)
      setSelectedImage(image)}}
     className={` ${SelectedImage ===image ? "border-4 border-white shadow-2xl  shadow-blue-950 " : "null"} w-[80px] h-[160px]  lg:w-[150px] lg:h-[250px] bg-[#0b0b2c] border-2 border-[#3f3fc4] rounded-2xl overflow-hidden cursor-pointer hover:scale-105 hover:shadow-blue-950  hover:shadow-2xl hover:border-4 hover:border-white transition-all duration-300`}>
      <img src={image}  className='h-full object-cover' alt="card img" />
    </div>
  )
}

export default Card


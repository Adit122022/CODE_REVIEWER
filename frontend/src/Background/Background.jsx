import React from 'react'
import bgVideo from "../assets/bg.mp4";

const Background = () => {
  return (
      <>
       {/* Background Video */}
       <div className="absolute inset-0 z-0">
       <video
         autoPlay
         loop
         muted
         playsInline
         className="w-full h-full object-cover"
       >
         <source src={bgVideo} type="video/mp4" />
       </video>
      
     </div></>
  )
}

export default Background
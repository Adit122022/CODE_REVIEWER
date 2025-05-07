import React from 'react';
import bgVideoDesktop from "../assets/bg.mp4";
import bgVideoMobile from "../assets/bg-mobile.mp4";

const Background = () => {
  return (
    <>
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {/* Desktop Video (hidden on mobile) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover hidden md:block"
        >
          <source src={bgVideoDesktop} type="video/mp4" />
        </video>
        
        {/* Mobile Video (hidden on desktop) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover block md:hidden"
        >
          <source src={bgVideoMobile} type="video/mp4" />
        </video>
      </div>
    </>
  );
};

export default Background;
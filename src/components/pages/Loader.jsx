import React from 'react'

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-teal-400 border-l-transparent animate-spin"></div>
        <div className="absolute inset-2 bg-white rounded-full"></div>
      </div>
    </div>
  )
}

export default Loader

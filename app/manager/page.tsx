import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'

function Managerpage() {
  console.log()
  return (
     <div className="flex min-h-screen bg-gray-100 flex-col ">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
      
        </div>
      </div>
    </div>
  )
}

export default Managerpage
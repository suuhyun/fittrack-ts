import Navbar from '@/components/shared/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full bg-[#f9fbfc]'>
      <Navbar />
      <hr />
      <Outlet />
    </div>
  )
}

export default RootLayout
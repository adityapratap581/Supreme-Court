import React from 'react'
import chistats_logo from '../assets/chistats_logo.svg'

const Header = () => {
  return (
    <header className='sticky top-0 z-10 flex items-center justify-between w-full p-2 bg-white shadow-md'>
       <h2 className='text-xl font-semibold'>Supreme Court Hackathon 2024</h2>
       <img src={chistats_logo} alt="company_logo" className='w-24'/> 
    </header>
  )
}

export default Header
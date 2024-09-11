import React, { useState } from 'react'
import Image from 'next/image'
import Drawer from '@/components/global/drawer'

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = () => {
    setIsDrawerOpen(true);
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  }

  return (
    <>
      <nav className="p-10 flex justify-between items-center max-sm:p-5">
        <Image src="/assets/icons/menu.svg" alt="logo" width={30} height={30} onClick={openDrawer} className='cursor-pointer hover:bg-gray-100 p-1' />
        <div className=' flex items-center gap-3'>
          <p className="text-2xl font-bold">Fizz</p>
        </div>
        <Image src="/assets/icons/light-mode.svg" alt="logo" width={30} height={30} className='cursor-pointer hover:bg-gray-100 p-1 rounded-lg' />
      </nav>
      <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  )
}

export default Navbar
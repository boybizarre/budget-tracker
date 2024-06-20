import React from 'react'
import Logo from '@/components/Logo';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative flex flex-col h-screen w-full items-center justify-center'>
      <Logo />
      <div className="mt-12">
        {children}
      </div>
    </div>
  )
}

export default layout;

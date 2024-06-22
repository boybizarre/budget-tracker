import React from 'react';
import { PiggyBank } from 'lucide-react';

function Logo() {
  return (
    <a href='/' className='flex items-center gap-2'>
      <PiggyBank className='h-11 w-11 stroke stroke-amber-500 stroke-[1.5]' />
      <p className='bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tighter text-transparent'>
        BudgetTracker
      </p>
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href='/' className='flex items-center gap-2'>
      {/* <PiggyBank className='h-11 w-11 stroke stroke-amber-500 stroke-[1.5]' /> */}
      <p className='bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tighter text-transparent'>
        BudgetTracker
      </p>
    </a>
  );
}

export default Logo;

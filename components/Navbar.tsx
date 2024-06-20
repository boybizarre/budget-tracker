'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { ThemeSwitcherBtn } from './ThemeSwitcherBtn';


import { UserButton } from '@clerk/nextjs';

// utilss
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

function Navbar() {
  return (
    <>
      <DesktopNavbar />
    </>
  );
}

const items = [
  { label: 'Dashboard', link: '/' },
  { label: 'Transactions', link: '/transactions' },
  { label: 'Manage', link: '/manage' },
];

function DesktopNavbar() {
  return (
    <div className='hidden border-separate border-b bg-background md:block'>
      <nav className='container flex items-center justify-between px-8'>
        <div className='flex h-[8rem] min-h-[6rem] items-center gap-x-4'>
          <Logo />
          <div className='flex h-full'>
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl='/sign-in' />
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({ label, link }: { label: string; link: string }) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className='relative flex items-center'>
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'w-full justify-start text-lg text-muted-foreground hover:text-foreground',
          isActive && 'text-foreground'
        )}
      >
        {label}
      </Link>
      {isActive && (
        <div className='absolute -bottom-[2px] left-1/2 hidden h-[2px] w-5/6 -translate-x-1/2 rounded-xl bg-foreground md:block' />
      )}
    </div>
  );
}

export default Navbar;

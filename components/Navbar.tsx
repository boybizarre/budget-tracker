'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { UserButton } from '@clerk/nextjs';

import { ThemeSwitcherBtn } from './ThemeSwitcherBtn';

// components
import Logo, { LogoMobile } from '@/components/Logo';

// utils
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from './ui/button';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';
import { Menu } from 'lucide-react';

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

const items = [
  { label: 'Dashboard', link: '/' },
  { label: 'Transactions', link: '/transactions' },
  { label: 'Manage', link: '/manage' },
];

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='block border-seperate bg-background md:hidden'>
      <nav className='container flex items-center justify-between px-8'>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className='w-[25rem] sm-[33.75rem]' side='left'>
            <Logo />
            <div className='flex flex-col gap-1 pt-4'>
              {items.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  onClick={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className='flex h-[5rem] min-h-[3.75rem] items-center gap-x-4'>
          <LogoMobile />
        </div>
        <div className='flex items-center gap-2'>
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl='/sign-in' />
        </div>
      </nav>
    </div>
  );
}

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

function NavbarItem({
  label,
  link,
  onClick,
}: {
  label: string;
  link: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  console.log(pathname);
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
        onClick={() => {
          if (onClick) onClick();
        }}
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

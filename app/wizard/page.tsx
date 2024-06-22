import React from 'react';
import Link from 'next/link';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '../.././components/ui/card';
import { Separator } from '../.././components/ui/separator';
import { Button } from '../.././components/ui/Button';

import Logo from '../.././components/Logo';

async function page() {
  const user = await useUser();
  console.log({ user }, 'user');
  if (!user) redirect('/sign-in');

  return (
    <div className='container flex max-w-2xl flex-col items-center justify-between gap-4'>
      <div>
        <h1 className='text-center text-3xl'>
          Welcome,{' '}
          <span className='ml-2 font-bold'>{user?.user?.firstName}!</span>
        </h1>
        <h2 className='mt-4 text-center text-base text-muted-foreground'>
          Let&apos;s get started by setting up yout currency
        </h2>
        <h3 className='mt-2 text-center text-sm text-muted-foreground'>
          You can change these settings at any time
        </h3>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set yout defaukt currrency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <Separator />
      <Button className='w-full' asChild>
        <Link href={'/'}>I&apos;m done! Take me to the dashboard</Link>
      </Button>
      <div className='mt-8'>
        <Logo />
      </div>
    </div>
  );
}

export default page;

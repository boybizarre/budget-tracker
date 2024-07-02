import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  // getting the current user from clerk
  const user = await currentUser();

  // checking if there is a user logged in
  if (!user) redirect('/sign-in');
  
  // checking if the user exist via the user.id
  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if(!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: 'USD',
      }
    })
  }

  // revalidate the home page that uses the currency
  revalidatePath('/');
  return Response.json(userSettings);
};

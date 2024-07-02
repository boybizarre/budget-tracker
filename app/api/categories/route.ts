import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { z } from 'zod';

export async function GET(request: Request) {
  // getting the current user from clerk
  const user = await currentUser();

  // checking if there is a user logged in
  if (!user) redirect('/sign-in');

  const { searchParams } = new URL(request.url);
  const param = searchParams.get('type');

  const validator = z.enum(['expense', 'income']).nullable();
  const queryParams = validator.safeParse(param);

  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // include type in the filters if it's defined
    },

    orderBy: {
      name: 'asc',
    },
  });

  return Response.json(categories);
}

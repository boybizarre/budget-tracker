'use server';

import prisma from '@/lib/prisma';
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from '@/schema/transaction';

import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) throw new Error(parsedBody.error.message);

  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const { amount, category, date, description, type } = parsedBody.data;

  // find the category in the database
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error('Category not found');
  }

  // NOTE: do not make confusion between $transaction ( prisma ) and prisma.transaction ( table )
  await prisma.$transaction([
    //  Create user transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        type,
        description: description || '',
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // update month aggregate table
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },

      // update if found
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },

      // else create
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
    }),

    // update year aggregate table
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },

      // update if found
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },

      // else create
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
    }),
  ]);
}

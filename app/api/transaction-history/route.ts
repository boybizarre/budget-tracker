import { OverviewQuerySchema } from '@/schema/overview';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { GetFormatterForCurrency } from '@/lib/helpers';

import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  // console.log({ from, to });

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const transactions = await getTransactionsHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(transactions);
}

export type GetTransactionHistoryResponseType = Awaited<ReturnType<typeof getTransactionsHistory>>;

async function getTransactionsHistory(userId: string, from:Date, to:Date) {

  // retriving the user's currency from the database
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    }
  });

  if(!userSettings) throw new Error('User settings not found');

  const formatter = GetFormatterForCurrency(userSettings.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },

    orderBy: {
      date: 'desc',
    },
  });

  console.log(transactions);

  return transactions.map(transaction => ({
    ...transaction,
    // formatting the amount with the user currency
    formattedAmount: formatter.format(transaction.amount),
  }))
}
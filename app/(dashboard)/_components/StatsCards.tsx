'use client';

import React, { useMemo, useCallback } from 'react';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import CountUp from 'react-countup';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';

import { Card } from '@/components/ui/card';
import SkeletonWrapper from '@/components/SkeletonWrapper';

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

function StatsCards({ from, to, userSettings }: Props) {
  
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ['overview', 'stats', from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  // shouldn't recalculate on every render unless the currency changes
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;

  return (
    <div className='relative flex w-full flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          title='Income'
          value={income}
          icon={
            <TrendingUp className='h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10' />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          title='Expense'
          value={expense}
          icon={
            <TrendingDown className='h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10' />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          title='Balance'
          value={balance}
          icon={
            <Wallet className='h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10' />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: React.ReactNode;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className='w-full flex h-24 items-center gap-2 p-4'>
      {icon}
      <div className='flex flex-col items-center gap-0'>
        <p className='text-muted-foreground'>{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className='text-2xl'
        />
      </div>
    </Card>
  );
}

'use client';

import React, { useMemo, useCallback } from 'react';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { GetCategoriesStatsResponseType } from '@/app/api/stats/categories/route';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { TransactionType } from '@/lib/types';

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

function CategoriesStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ['overview', 'stats', 'categories', from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  // shouldn't recalculate on every render unless the currency changes
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className='w-full flex flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type='income'
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type='expense'
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
}

export default CategoriesStats;

function CategoriesCard({
  data,
  type,
  formatter,
}: {
  type: TransactionType;
  formatter: Intl.NumberFormat;
  data: GetCategoriesStatsResponseType;
}) {
  const filteredData = data.filter((item) => item.type === type);
  const total = filteredData.reduce(
    (acc, item) => acc + (item._sum?.amount || 0),
    0
  );

  return (
    <Card className='h-80 w-full col-span-6'>
      <CardHeader>
        <CardTitle className='grid grid-flow-row justify-between gap-2 md:grid-flow-col text-muted-foreground'>
          {type === 'income' ? 'Incomes' : 'Expenses'} by Category
        </CardTitle>
      </CardHeader>

      <div className='flex items-center justify-between gap-2'>
        {filteredData.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-60 w-full'>
            No data for the selected period
            <p className='text-muted-foreground tex-sm'>
              Try selecting a different period or try adding new{' '}
              {type === 'income' ? 'incomes' : 'expenses'}
            </p>
          </div>
        ) : (
          <ScrollArea className='h-60 w-full px-4'>
            <div className='flex flex-col gap-4 p-4'>
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                      <span className='flex items-center text-gray-400'>
                        {item.categoryIcon} {item.category}
                        <span className='ml-2 text-xs text-muted-foreground'>
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>

                      <span className='text-sm text-gray-400'>
                        {formatter.format(amount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      indicator={
                        type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}

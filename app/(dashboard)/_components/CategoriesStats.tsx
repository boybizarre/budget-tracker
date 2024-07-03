'use client';

import React, { useMemo, useCallback } from 'react';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
// import CountUp from 'react-countup';

import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { GetCategoriesStatsResponseType } from '@/app/api/stats/categories/route';

import { Card } from '@/components/ui/card';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { TransactionType } from '@/lib/types';

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
};

function CategoriesStats({ userSettings, from, to }: Props) {

  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ['overview', 'stats', 'categories', from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  // shouldn't recalculate on every render unless the currency changes
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return <div className='w-full flex flex-wrap gap-2 md:flex-nowrap'>
    <SkeletonWrapper isLoading={statsQuery.isFetching}>
      <CategoriesCard
        formatter={formatter}
        type='income'
        data={statsQuery.data || []}
      />
    </SkeletonWrapper>
  </div>;
}

export default CategoriesStats;

function CategoriesCard({ data, type, formatter }: {
  type: TransactionType;
  formatter: Intl.NumberFormat;
  data: GetCategoriesStatsResponseType,
}) {
  const filteredData = data.filter((item) => item.type === type);
  const total = filteredData.reduce((acc, item) =>  acc + (item._sum?.amount || 0), 0);

  return (
    <Card className='h-80 w-full'>
      
    </Card>
  )
}
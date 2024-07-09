'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { UserSettings } from '@prisma/client';

import { GetFormatterForCurrency } from '@/lib/helpers';
import { TimeFrame, Period } from '@/lib/types';
import { cn } from '@/lib/utils';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SkeletonWrapper from '@/components/SkeletonWrapper';

import HistoryPeriodSelector from './HistoryPeriodSelector';
import { GetHistoryDataResponseType } from '@/app/api/history-data/route';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import CountUp from 'react-countup';

function History({ userSettings }: { userSettings: UserSettings }) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  // shouldn't recalculate on every render unless the currency changes
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const historyDataQuery = useQuery<GetHistoryDataResponseType>({
    queryKey: ['overview', 'history', timeFrame, period],
    queryFn: () =>
      fetch(
        `/api/history-data?timeFrame=${timeFrame}&year=${period.year}&month=${period.month}`
      ).then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  console.log(historyDataQuery.data);

  const dataAvailable =
    historyDataQuery.data && historyDataQuery.data.length > 0;

  return (
    <div className='container'>
      <h2 className='mt-12 mb-8 text-3xl font-bold'>History</h2>
      <Card className='col-span-12 mt-2 w-full'>
        <CardHeader className='gap-2'>
          <CardTitle className='grid grid-flow-row justify-between gap-2 md:grid-flow-col'>
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />

            <div className='flex h-10 gap-2'>
              <Badge
                variant='outline'
                className='flex items-center gap-2 text-sm'
              >
                <div className='h-4 w-4 rounded-full bg-emerald-500'></div>
                <span>Income</span>
              </Badge>
              <Badge
                variant='outline'
                className='flex items-center gap-2 text-sm'
              >
                <div className='h-4 w-4 rounded-full bg-red-500'></div>
                <span>Expense</span>
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable ? (
              <ResponsiveContainer height={300} width='100%'>
                <BarChart
                  height={300}
                  data={historyDataQuery.data}
                  barCategoryGap={5}
                >
                  <defs>
                    <linearGradient id='incomeBar' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset={0} stopColor='#10b981' stopOpacity={1} />
                      <stop offset={1} stopColor='#10b981' stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id='expenseBar' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset={0} stopColor='#ef4444' stopOpacity={1} />
                      <stop offset={1} stopColor='#ef4444' stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray='5 5'
                    strokeOpacity='0.2'
                    vertical={false}
                  />

                  <XAxis
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      console.log(data, 'XAxis data');
                      const date = new Date(year, month, day || 1);
                      if (timeFrame === 'year') {
                        return date.toLocaleString('default', {
                          month: 'long',
                        });
                      }

                      return date.toLocaleString('default', {
                        day: '2-digit',
                      });
                    }}
                  />

                  <YAxis
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip cursor={{ opacity: 0.1 }} content={props => (
                    <CustomTooltip formatter={formatter} {...props} />
                  )} />

                  {/* <Legend /> */}

                  <Bar
                    dataKey={'income'}
                    label='Income'
                    fill='url(#incomeBar)'
                    radius={4}
                    className='cursor-pointer'
                  />

                  <Bar
                    dataKey={'expense'}
                    label='Expense'
                    fill='url(#expenseBar)'
                    radius={4}
                    className='cursor-pointer'
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Card className='flex h-[300px] flex-col items-center justify-center bg-background'>
                No data for the selected period
                <p>
                  Try selecting a different period or adding new transactions
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

export default History;

function CustomTooltip({ active, payload, formatter }: any) {
  if(!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload
  const { expense, income } = data;

  return (
    <div className='min-w-[300px] rounded bg-background p-4'>
      <TooltipRow 
        formatter={formatter}
        label='Expense'
        value={expense}
        bgColor='bg-red-500'
        textColor='text-red-500'
      />

      <TooltipRow 
        formatter={formatter}
        label='Income'
        value={income}
        bgColor='bg-emerald-500'
        textColor='text-emerald-500'
      />

      <TooltipRow 
        formatter={formatter}
        label='Balance'
        value={income - expense}
        bgColor='bg-gray-500'
        textColor='text-forground'
      />
    </div>
  )
}

function TooltipRow({ label, value, bgColor, textColor, formatter }: {
  label: string, textColor: string, bgColor: string, value: number, formatter: Intl.NumberFormat
}) {

  const formattingFn = useCallback((value: number) => {
    return formatter.format(value);
  }, [formatter]);

  return (
    <div className='flex items-center gap-2'>
      <div className={cn('h-4 w-4 rounded-full', bgColor)} />
      <div className='flex w-full justify-between'>
        <p className='text-sm text-muted-foreground'>{label}</p>
        <div className={cn('text-sm font-bold', textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            formattingFn={formattingFn}
            className='text-sm'
          />
        </div>
      </div>
    </div>
  );
}
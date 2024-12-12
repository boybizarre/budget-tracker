'use client';

import { GetHistoryPeriodsResponseType } from '@/app/api/history-periods/route';

import { TimeFrame, Period } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@/components/ui/select';
import SkeletonWrapper from '@/components/SkeletonWrapper';

interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
}
function HistoryPeriodSelector({
  period,
  setPeriod,
  timeFrame,
  setTimeFrame,
}: Props) {
  const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ['overview', 'history', 'periods'],
    queryFn: () => fetch(`/api/history-periods`).then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
        <Tabs
          value={timeFrame}
          onValueChange={(value) => setTimeFrame(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value='year'>Year</TabsTrigger>
            <TabsTrigger value='month'>Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className='flex flex-wrap items-center gap-2'>
        <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data || []}
          />
        </SkeletonWrapper>
        {timeFrame === 'month' && (
          <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

export default HistoryPeriodSelector;

function YearSelector({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriodsResponseType;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        // setting to state value from the SelectItem
        setPeriod({
          month: period.month, // month state remains unchanged
          year: parseInt(value), // "2024" to 2024
        });
      }}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select year...' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function MonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        // setting to state value from the SelectItem
        setPeriod({
          month: parseInt(value), // "0" to 0
          year: period.year, // year state remains unchanged
        });
      }}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select month...' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
            const monthStr = new Date(period.year, month, 1).toLocaleString(
              'default',
              { month: 'long' }
            );

            // console.log(monthStr);

            return (
              <SelectItem key={month} value={month.toString()}>
                {monthStr}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

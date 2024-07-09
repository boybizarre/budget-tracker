import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { differenceInDays, isValid } from 'date-fns';
import { z } from 'zod';

export const OverviewQuerySchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((args) => {
    const { from, to } = args;

    const days = differenceInDays(to, from);
    console.log(days);
    // if difference in from date and to date is greater than 0 and less than max range days
    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;
    return isValidRange;
  });

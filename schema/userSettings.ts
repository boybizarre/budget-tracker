import { CURRENCIES } from '@/lib/currencies';
import { z } from 'zod';

export const UpdateUserCurrencySchema = z.object({

  // custom validation
  currency: z.custom((value) => {
    const found = CURRENCIES.some((currency) => currency.value === value);
    if (!found) {
      throw new Error(`Invalid currency ${value}`);
    }

    return value;
  }),
});

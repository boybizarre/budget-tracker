'use client';

import React, { useEffect, useCallback } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import SkeletonWrapper from '@/components/SkeletonWrapper';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// lib
import { CURRENCIES } from '@/lib/currencies';
import { Option } from '@/lib/types';
import { UserSettings } from '@prisma/client';

import { UpdateUserCurrency } from '@/app/wizard/_actions/userSettings';

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(
    null
  );

  const userSettings = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    queryFn: async () => {
      return await fetch('/api/user-settings').then((res) => res.json());
    },
  });

  // useEffect
  useEffect(() => {
    if (!userSettings.data) return;

    const userCurrency = CURRENCIES.find(
      (currency) => currency.value === userSettings.data.currency
    );

    // setting the users currency fetched from database as the default selected option;
    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettings.data]);

  // functions
  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success(`Currency updated successfully!`, {
        id: 'update-currency',
      });

      // settings the newly changed currency as the default selected option
      setSelectedOption(
        CURRENCIES.find((currency) => data.currency === currency.value || null)!
      );
    },

    onError: (error) => {
      console.error(error);
      toast.error('Something went wrong', {
        id: 'update-currency',
      });
    },
  });

  const selectOption = useCallback(
    (currency: Option | null) => {
      if (!currency) {
        toast.error('Please select a currency');
        return;
      }

      toast.loading('Updating currency...', {
        id: 'update-currency',
      });

      mutation.mutate(currency.value);
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-full justify-start'
              disabled={mutation.isPending}
            >
              {selectedOption ? (
                <>{selectedOption.label}</>
              ) : (
                <>+ Set currency</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0' align='start'>
            <OptionsList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant='outline'
            className='w-full justify-start'
            disabled={mutation.isPending}
          >
            {selectedOption ? <>{selectedOption.label}</> : <>+ Set currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className='mt-4 border-t'>
            <OptionsList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionsList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Option | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder='Filter currency...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {CURRENCIES.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  CURRENCIES.find((currency) => currency.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TransactionType } from '@/lib/types';
import { Category } from '@prisma/client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { Button } from '@/components/ui/button';
import CreateCategoryDialog from './CreateCategoryDialog';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  onChange: (value: string) => void;
  type: TransactionType;
}

function CategoryPicker({ type, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if(!value) return;
    // when the value changes call the onChange function
    onChange(value); 

  }, [onChange, value]);

  const { data } = useQuery({
    queryKey: ['categories', type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory: Category = data?.find(
    (category: Category) => category.name === value
  );

  const successCallback = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            'Select category'
          )}
          <ChevronsUpDown className='ml-2 w-4 h-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder='Search category...' />
          <CreateCategoryDialog
            type={type}
            successCallback={successCallback}
          />
          <CommandList>
            <CommandEmpty>
              <p>Category not found</p>
              <p className='text-xs text-muted-foreground'>
                Tip: Create a new category
              </p>
            </CommandEmpty>
            <CommandGroup heading='Categories'>
              {data &&
                data.map((category: Category) => (
                  <CommandItem
                    key={category.name}
                    onSelect={(currentValue) => {
                      // console.log(currentValue);
                      // console.log(category.name);
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <CategoryRow category={category} />
                    {value === category.name && (
                      <Check className='ml-2 w-4 h-4' />
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className='flex items-center gap-2'>
      <span role='img'>{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}

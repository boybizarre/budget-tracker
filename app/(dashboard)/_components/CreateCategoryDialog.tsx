'use client';

import { useState, useCallback } from 'react';

import { Category } from '@prisma/client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTheme } from 'next-themes';
import { PlusSquare, CircleOff, Loader2 } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';
import { TransactionType } from '@/lib/types';

import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/schema/categories';

import { CreateCategory } from '../actions/categories';

import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  type: TransactionType,
  successCallback: (category: Category) => void;
}

function CreateCategoryDialog({ type, successCallback }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: '',
        icon: '',
        type,
      });

      toast.success(`Category ${data.name} created successfully `, {
        id: 'create-category',
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      setOpen((prev) => !prev);
    },
    onError: (error) => {
      console.log(error, 'error');
      toast.error('Something went wrong', {
        id: 'create-category',
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading('Creating category...', {
        id: 'create-category',
      });

      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          variant={'ghost'}
          className='flex border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground w-full'
        >
          <PlusSquare className='mr-2 h-4 w-4' />
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create{' '}
            <span
              className={cn(
                'm-1',
                type === 'income' ? 'text-emerald-500' : 'text-red-500'
              )}
            >
              {type}
            </span>
            category
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Category' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className='h-[100px] w-full' variant={'ghost'}>
                          {form.watch('icon') ? (
                            <div className='flex flex-col items-center gap-2'>
                              <span role='img' className='text-5xl'>
                                {field.value}
                              </span>
                              <p className='text-xs text-muted-foreground'>
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className='flex flex-col items-center gap-2'>
                              <CircleOff className='h-[48px] w-[48px]' />
                              <p className='text-xs text-muted-foreground'>
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-full'>
                        <Picker
                          data={data}
                          theme={theme.resolvedTheme}
                          onEmojiSelect={(emoji: { native: string }) =>
                            field.onChange(emoji.native)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type='button'
              variant={'secondary'}
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? <Loader2 className='animate-spin' /> : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCategoryDialog;

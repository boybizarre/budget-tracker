'use client';

import { Category } from '@prisma/client';
import { ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { TransactionType } from '@/lib/types';
import { DeleteCategory } from '../actions/categories';

interface Props {
  category: Category;
  trigger: ReactNode;
}

function DeleteCategoryDialog({
  category,
  trigger,
}:
Props) {
  const categoryIdentifier = `${category.name}-${category.type}`;
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success('Category deleted successfully', {
        id: categoryIdentifier,
      });

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      });
    },

    onError: () => {
      toast.success('Something went wrong', {
        id: categoryIdentifier,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              category.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter></AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading('Deleting category...', {
                id: categoryIdentifier,
              });

              deleteMutation.mutate({
                name: category.name,
                type: category.type as TransactionType,
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCategoryDialog;

'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { DatePicker } from '../../create-coupon/_components/DatePicker';
import { MultiSelectServiceNames } from '../../create-coupon/_components/MultiSelectServiceNames';
import { MultiSelectUser } from '../../create-coupon/_components/MultiSelectUser';
import { updateCoupon } from '../_services/services';

interface CouponUpdateFormProps {
  data: any; // The existing coupon data
  onClose: () => void; // Function to close the dialog
  fetchCoupons: () => void;
}
const couponSchema = z.object({
  expiryDate: z.date().refine((date) => date !== null, {
    message: 'Expiry date is required',
  }),
  maxRedemptions: z.coerce
    .number()
    .min(1, 'Max redemptions must be at least 1'),
  maxRedemptionsPerUser: z.coerce
    .number()
    .int()
    .positive()
    .min(1, 'value must be greater than 0')
    .optional(),
  isActive: z.boolean().default(true),
  minimumOrderValue: z.coerce
    .number()
    .positive()
    .min(1, 'value must be greater than 0')
    .optional(),
  validServices: z.array(z.string()).optional(),
  validUsers: z.array(z.string()).optional(),
  isFirstTimeUser: z.boolean().default(false),
  isStackable: z.boolean().default(true),
});

export default function CouponUpdateForm({
  data,
  onClose,
  fetchCoupons,
}: CouponUpdateFormProps) {
  const [loading, setLoading] = useState(false);
  const validServicesData = data.validServices.map((item: any) => item._id);
  const validUsersData = data.validUsers.map((item: any) => item._id);
  const defaultUsersData = data.validUsers.map((item: any) => ({
    value: item._id,
    label: item.name && item.name.trim() ? item.name : item.email,
  }));

  const form = useForm<z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      expiryDate: new Date(data.expiryDate),
      maxRedemptions: Number(data.maxRedemptions),
      maxRedemptionsPerUser: Number(data.maxRedemptionsPerUser) || undefined,
      isActive: data.isActive,
      minimumOrderValue: Number(data.minimumOrderValue) || undefined,
      isFirstTimeUser: data.isFirstTimeUser,
      validServices: validServicesData,
      validUsers: validUsersData,
      isStackable: data.isStackable,
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: any) => updateCoupon(data.code, formData),
    onSuccess: () => {
      toast.success('Coupon updated successfully!');
      fetchCoupons();
      onClose(); // Close the dialog
      setLoading(false);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error('Failed to update the coupon.');
      onClose(); // Close the dialog
      setLoading(false);
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof couponSchema>> = (data) => {
    setLoading(true);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='maxRedemptions'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Redemptions</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min={Math.max(data.redemptions, data.maxRedemptionsPerUser)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='maxRedemptionsPerUser'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Redemptions Per User</FormLabel>
              <FormControl>
                <Input type='number' max={data.maxRedemptions} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='minimumOrderValue'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Order Value</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='expiryDate'
          render={({ field }) => (
            <FormItem className='mt-2.5 flex flex-col'>
              <FormLabel>
                Expiration Date <span className='text-red-600'>*</span>
              </FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              </FormControl>
              <FormMessage className='text-xs text-red-500' />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Applicable Services (optional)</FormLabel>
          <FormControl>
            <Controller
              //   {...field}
              name='validServices'
              control={form.control}
              render={({ field }) => (
                <MultiSelectServiceNames
                  options={[]}
                  onValueChange={field.onChange}
                  defaultValue={field.value || []}
                  placeholder='Select services'
                  // variant='inverted'
                  // animation={2}
                  maxCount={3}
                />
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormField
          control={form.control}
          name='validUsers'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eligible Users (optional)</FormLabel>
              <FormControl>
                <MultiSelectUser
                  options={[]}
                  onValueChange={field.onChange}
                  defaultValue={defaultUsersData || []}
                  placeholder='Select users'
                  formName='update form'
                  maxCount={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='mb-4 flex flex-wrap items-center gap-6 rounded-md border bg-white p-4'>
          <FormItem className='flex items-end gap-2'>
            <FormControl>
              <Controller
                name='isActive'
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    // {...field}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </FormControl>
            <FormLabel>Active Coupon</FormLabel>
            <FormMessage />
          </FormItem>

          <FormItem className='flex items-end gap-2'>
            <FormControl>
              <Controller
                name='isFirstTimeUser'
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    // {...field}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </FormControl>
            <FormLabel>First-Time User Only</FormLabel>
            <FormMessage />
          </FormItem>

          <FormItem className='flex items-end gap-2'>
            <FormControl>
              <Controller
                name='isStackable'
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    // {...field}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </FormControl>
            <FormLabel>Can Be Combined with Other Coupons</FormLabel>
            <FormMessage />
          </FormItem>
        </div>

        <div className='flex justify-end space-x-4'>
          <Button variant='outline' type='button' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit'>
            {' '}
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

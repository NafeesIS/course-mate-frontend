'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useUserSignInDetails } from '@/store/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Save, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { createCoupon } from '../_services/services';
import CouponDialog from './CouponDialog';
import { DatePicker } from './DatePicker';
import { MultiSelectServiceNames } from './MultiSelectServiceNames';
import { MultiSelectUser } from './MultiSelectUser';

// Validation schema using Zod
export const couponSchema = z.object({
  code: z.string().optional(),
  type: z.string().min(1, { message: 'Type is required' }),
  value: z.number().min(1, 'Value must be greater than 0'),
  expiryDate: z.date().refine((date) => date !== null, {
    message: 'Expiry date is required',
  }),
  maxRedemptions: z.number().min(1, 'Max redemptions must be at least 1'),
  maxRedemptionsPerUser: z
    .number()
    .int()
    .positive()
    .min(1, 'value must be greater than 0')
    .optional(),
  isActive: z.boolean().default(true),
  minimumOrderValue: z
    .number()
    .positive()
    .min(1, 'value must be greater than 0')
    .optional(),
  validServices: z.array(z.string()).optional(),
  validUsers: z.array(z.string()).optional(),
  isFirstTimeUser: z.boolean().default(false),
  isStackable: z.boolean().default(true),
  createdBy: z.string(),
});

export default function CouponCreationForm() {
  const { userSignInDetails } = useUserSignInDetails();
  const userId = userSignInDetails?.data._id;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const form = useForm<z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      isActive: true,
      isStackable: true,
      isFirstTimeUser: false,
      validServices: [],
      validUsers: [],
      createdBy: userId,
      type: '',
    },
  });

  const mutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: (response) => {
      toast.success('Coupon created successfully!');
      setResponseData(response.data); // Save response data
      setDialogOpen(true); // Open dialog
      form.reset();
    },
    onError: (error) => {
      console.error(error);
      toast.error('An error occurred while creating the coupon.');
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof couponSchema>> = (data) => {
    mutation.mutate(data);
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <p className='mb-2 text-base font-semibold lg:text-lg'>
            Coupon Details
          </p>
          <div className='rounded-md border bg-white p-4'>
            <div className='mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Discount Type <span className='text-red-600'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className='h-10'>
                            <SelectValue placeholder='Select a type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='percentage'>
                              Percentage
                            </SelectItem>
                            <SelectItem value='flat'>Flat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage className='text-xs text-red-500' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='value'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Discount Value <span className='text-red-600'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type='number'
                          required
                          placeholder={
                            form.watch('type') === 'percentage'
                              ? 'Enter a percentage value between 1 and 100.'
                              : 'Enter a number'
                          }
                          min={1}
                          max={
                            form.watch('type') === 'percentage'
                              ? 100
                              : undefined
                          }
                          value={field.value || ''} // Ensure an empty string when undefined/null
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            // Prevent exceeding max if percentage is selected
                            if (
                              form.watch('type') === 'percentage' &&
                              value > 100
                            )
                              return;
                            field.onChange(value);
                          }}
                          disabled={!form.watch('type')} // Disable until type is selected
                          className={`h-10 rounded-md bg-background pl-3 ${
                            form.watch('type')
                              ? ''
                              : 'cursor-not-allowed opacity-50'
                          }`}
                        />
                        {form.watch('type') === 'percentage' && (
                          <span className='absolute right-8 top-1/2 -translate-y-1/2 text-gray-500'>
                            %
                          </span>
                        )}
                      </div>
                    </FormControl>
                    {!form.watch('type') && (
                      <FormDescription className='text-xs text-gray-500'>
                        Please select a discount type before entering the
                        discount value.
                      </FormDescription>
                    )}
                    <FormMessage className='text-xs text-red-500' />
                  </FormItem>
                )}
              />
            </div>

            <div className='mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <FormField
                control={form.control}
                name='maxRedemptions'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Max Redemptions Allowed{' '}
                      <span className='text-red-600'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        required
                        placeholder='Enter a number'
                        min={1}
                        value={field.value || ''} // Ensure value is not undefined
                        onChange={(e) => field.onChange(e.target.valueAsNumber)} // Convert to number
                        className='h-10 rounded-md bg-background pl-3'
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-red-500' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='maxRedemptionsPerUser'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Max Redemptions Allowed Per User (optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter a number'
                        value={field.value || ''} // Ensure value is not undefined
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          if (isNaN(value) || value <= 0) {
                            field.onChange(undefined); // Reset the field to undefined for invalid inputs
                          } else {
                            field.onChange(value); // Allow valid positive numbers
                          }
                        }}
                        className='h-10 rounded-md bg-background pl-3'
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-red-500' />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <FormField
                control={form.control}
                name='minimumOrderValue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Order Amount (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter a number'
                        value={field.value || ''} // Ensure value is not undefined
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          if (isNaN(value) || value <= 0) {
                            field.onChange(undefined); // Reset the field to undefined for invalid inputs
                          } else {
                            field.onChange(value); // Allow valid positive numbers
                          }
                        }}
                        className='h-10 rounded-md bg-background pl-3'
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-red-500' />
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
            </div>
            <div className='mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <FormItem>
                <FormLabel>Applicable Services (optional)</FormLabel>
                <FormControl>
                  <Controller
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
                <FormDescription>
                  Optional: Select a service to make this coupon
                  service-specific, or leave it blank for all services.
                </FormDescription>
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
                        defaultValue={field.value || []}
                        placeholder='Select users'
                        maxCount={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Enter email to make this coupon
                      service-specific, or leave it blank for all users.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <p className='mb-2 mt-4 text-base font-semibold lg:text-lg'>
            Rules & Exceptions
          </p>
          <div className='mb-4 grid grid-cols-1 gap-6 rounded-md border bg-white p-4 lg:grid-cols-3'>
            <FormItem className='flex items-end gap-2'>
              <FormControl>
                <Controller
                  name='isActive'
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
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
          <div className='mb-4 grid grid-cols-1 gap-6'>
            <FormItem>
              <FormLabel className='text-base font-semibold lg:text-lg'>
                Coupon Code{' '}
                <span className='text-sm lg:text-base'>(optional)</span>
              </FormLabel>
              <div className='rounded-md bg-white p-4'>
                <FormControl>
                  <Input
                    placeholder='Leave empty to auto-generate'
                    {...form.register('code')}
                  />
                </FormControl>
                <FormDescription className='mt-2'>
                  Optional: Enter a custom coupon code or leave blank to
                  auto-generate.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          </div>
          <Separator className='mt-4' />
          <div className='mt-4 flex justify-end space-x-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}
              className='flex items-center space-x-1 duration-200 hover:bg-slate-300'
            >
              <X size={16} />
              <span>Clear</span>
            </Button>
            <Button type='submit' className='flex items-center space-x-1'>
              <Save size={16} />
              <span>Create Coupon</span>
            </Button>
          </div>
        </form>
      </Form>
      {/* Dialog Component */}
      <CouponDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        responseData={responseData}
      />
    </>
  );
}

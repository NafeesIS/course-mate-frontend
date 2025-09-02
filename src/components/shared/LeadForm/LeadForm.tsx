'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BASE_URL_BACKEND, BASE_URL_FRONTEND } from '@/constants';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { RiArrowDownSLine, RiErrorWarningLine } from 'react-icons/ri';
import { z } from 'zod';

const formSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    contactNo: z.string().min(1, 'Contact number is required'),
    email: z
      .string()
      .email('Invalid email address')
      .min(1, 'Email is required'),
    serviceType: z
      .array(
        z.enum([
          'Income Tax & GST',
          'Company compliance',
          'Company Data',
          'Other',
        ])
      )
      .min(1, 'Please select at least one service type'),
    otherService: z.string().optional(),
    sources: z.array(z.string()).min(1, 'Source is required'),
    pathname: z.string().min(1, 'Pathname is required'),
  })
  .superRefine((data, ctx) => {
    if (data.serviceType.includes('Other') && !data.otherService) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please specify the service required',
        path: ['otherService'],
      });
    }
  });

type FormData = z.infer<typeof formSchema>;

interface LeadFormProps {
  source: string;
  className?: string;
}

interface ErrorResponse {
  message: string;
  errorSources?: { path: string; message: string }[];
}

const saveLead = async (leadData: FormData): Promise<any> => {
  const response = await axios.post(
    `${BASE_URL_BACKEND}/api/v1/leads/addLead`,
    leadData
  );
  return response.data;
};

export function LeadForm({ source, className }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: [], // Set default value as an empty array
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Set the sources value
  setValue('sources', [source]);
  setValue('pathname', window.location.href);

  const mutation = useMutation<any, AxiosError<ErrorResponse>, FormData>({
    mutationFn: saveLead,
    onMutate: () => {
      setIsLoading(true);
      setIsError(false);
    },
    onSuccess: () => {
      setIsLoading(false);
      setModalMessage(
        'Form submitted successfully. We will reach out to you shortly.'
      );
      setIsModalOpen(true);
      reset();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      setIsLoading(false);
      const errorMessage =
        'Form submission failed: ' + error.response?.data?.message ||
        'Please try again later.';
      setModalMessage(errorMessage);
      setIsError(true);
      setIsModalOpen(true);
    },
  });

  const serviceType = watch('serviceType');

  const onSubmit = (data: FormData) => {
    // Ensure serviceType is an array before submission
    const formData = {
      ...data,
      serviceType: Array.isArray(data.serviceType)
        ? data.serviceType
        : [data.serviceType],
    };

    mutation.mutate(formData);
  };

  return (
    <>
      <Card className={cn('w-full max-w-md rounded-md pt-6', className)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='space-y-2 pb-4'>
            <Input
              id='name'
              type='text'
              placeholder='Name'
              className={cn(errors.name && 'border-red-600')}
              {...register('name')}
            />
            {errors.name && (
              <p className='mt-1 flex items-center justify-center gap-1 text-xs text-red-600'>
                <RiErrorWarningLine className='text-sm' /> {errors.name.message}
              </p>
            )}

            <Input
              id='contactNo'
              type='tel'
              placeholder='Contact Number'
              className={cn(errors.contactNo && 'border-red-600')}
              {...register('contactNo')}
            />
            {errors.contactNo && (
              <p className='mt-1 flex items-center justify-center gap-1 text-xs text-red-600'>
                <RiErrorWarningLine className='text-sm' />{' '}
                {errors.contactNo.message}
              </p>
            )}

            <div>
              <Input
                id='email'
                type='email'
                placeholder='Email'
                className={cn(errors.email && 'border-red-600')}
                {...register('email')}
              />
              {errors.email && (
                <p className='mt-1 flex items-center justify-center gap-1 text-xs text-red-600'>
                  <RiErrorWarningLine className='text-sm' />{' '}
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='lg'
                    className={cn(
                      'h-9 w-full justify-between px-3 text-sm text-muted-foreground shadow',
                      errors.serviceType && 'border-red-600'
                    )}
                  >
                    Type of Services Required <RiArrowDownSLine />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-72'>
                  <DropdownMenuLabel>Service Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={serviceType.includes('Income Tax & GST')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue('serviceType', [
                          ...serviceType,
                          'Income Tax & GST',
                        ]);
                      } else {
                        setValue(
                          'serviceType',
                          serviceType.filter(
                            (type) => type !== 'Income Tax & GST'
                          )
                        );
                      }
                    }}
                  >
                    Income Tax & GST
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={serviceType.includes('Company compliance')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue('serviceType', [
                          ...serviceType,
                          'Company compliance',
                        ]);
                      } else {
                        setValue(
                          'serviceType',
                          serviceType.filter(
                            (type) => type !== 'Company compliance'
                          )
                        );
                      }
                    }}
                  >
                    Company compliance
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={serviceType.includes('Company Data')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue('serviceType', [
                          ...serviceType,
                          'Company Data',
                        ]);
                      } else {
                        setValue(
                          'serviceType',
                          serviceType.filter((type) => type !== 'Company Data')
                        );
                      }
                    }}
                  >
                    Company Data
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={serviceType.includes('Other')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue('serviceType', [...serviceType, 'Other']);
                      } else {
                        setValue(
                          'serviceType',
                          serviceType.filter((type) => type !== 'Other')
                        );
                      }
                    }}
                  >
                    Other
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {serviceType && serviceType.length > 0 && (
                <div className='mt-4 flex flex-wrap gap-1.5'>
                  {serviceType.map((service) => (
                    <p
                      key={service}
                      className='w-fit rounded-md bg-muted-foreground px-2 py-1 text-xs text-background'
                    >
                      {service}
                    </p>
                  ))}
                </div>
              )}

              {errors.serviceType && (
                <p className='mt-1 flex items-center justify-center gap-1 text-xs text-red-600'>
                  <RiErrorWarningLine className='text-sm' />{' '}
                  {errors.serviceType.message}
                </p>
              )}
            </div>

            {serviceType?.includes('Other') && (
              <div>
                <Textarea
                  id='otherService'
                  placeholder='Please specify the other service here..'
                  className={cn(errors.otherService && 'border-red-600')}
                  {...register('otherService')}
                />
                {errors.otherService && (
                  <p className='mt-1 flex items-center justify-center gap-1 text-xs text-red-600'>
                    <RiErrorWarningLine className='text-sm' />{' '}
                    {errors.otherService?.message}
                  </p>
                )}
              </div>
            )}
            <div className='mt-2 flex items-start space-x-2 text-left md:mt-2.5'>
              <input
                type='checkbox'
                id='agreeToTerms'
                required
                className='mt-0.5 h-4 w-4 rounded border-2 text-primary focus:ring-primary'
              />
              <label
                htmlFor='agreeToTerms'
                className='cursor-pointer text-[10px] sm:text-xs'
              >
                By submitting the form, I agree to the{' '}
                <Link
                  className='text-primary duration-75 hover:underline'
                  href={`${BASE_URL_FRONTEND}/privacy-policy`}
                  target='_blank'
                >
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link
                  className='text-primary duration-75 hover:underline'
                  href={`${BASE_URL_FRONTEND}/terms-and-conditions`}
                  target='_blank'
                >
                  Terms & Conditions
                </Link>
              </label>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col items-center justify-center'>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Consult an Expert'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogTitle className='flex items-center space-x-2'>
            {isError ? (
              <AiOutlineCloseCircle className='text-red-600' size={24} />
            ) : (
              <AiOutlineCheckCircle className='text-green-600' size={24} />
            )}
            <span>
              {isError ? 'Submission Failed' : 'Submission Successful'}
            </span>
          </DialogTitle>
          <DialogDescription
            className={isError ? 'text-red-600' : 'text-green-600'}
          >
            {modalMessage}
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setIsModalOpen(false)}
              className='mt-4 w-full'
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
